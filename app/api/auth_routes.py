from operator import or_
from flask import Blueprint, jsonify, session, request
from app.models import User, db, Channel, Server, Message, Role, ServerUser, UserRoles, Friend
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required
from app.aws_s3 import upload_file_to_s3
from app.config import Config
from datetime import datetime
from sqlalchemy.orm import joinedload
from sqlalchemy import or_
from random import randint
from flask_socketio import emit



auth_routes = Blueprint('auth', __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:

        user = User.query.get(current_user.id)
        # User.query.filter(User.id == current_user.id).update({'online': True})
        user.online = True
        # db.session.merge(user)
        db.session.add(user)
        db.session.commit()

        server_users = ServerUser.query.filter(current_user.id == ServerUser.user_id).all()
        servers = [ Server.query.get(server.server_id) for server in server_users ]
        serverIds = [server.id for server in servers ]

        data = {
            'user': current_user.to_dict(),
            'servers': [ server.to_dict() for server in servers ],
            'friends': None,
        }
        data['user']['online'] = True

        for server in data['servers']:
            channel_list = Channel.query.filter(Channel.server_id == server['id']).all()
            server['channels'] = [ channel.to_dict() for channel in channel_list ]

            for channel in server['channels']:
                message_list = Message.query.filter(Message.channel_id == channel['id']).all()
                channel['messages'] = [ message.to_dict() for message in message_list ]

            user_id_list = ServerUser.query.filter(ServerUser.server_id == server['id']).all()
            users = []
            for server_user in user_id_list:
                user_list = User.query.filter(User.id == server_user.user_id).all()
                users.append(*[user.to_dict() for user in user_list])
            server['users'] = users

            for user in users:
                roles = Role.query.select_from(UserRoles).filter(UserRoles.user_id == user['id']).all()
                if len(roles) > 0:
                    for role in roles:
                        if role.server_id == server['id']:
                            user['role'] = role.to_dict()
                            break

        friends = Friend.query.filter(or_(Friend.sender_id == user['id'], Friend.receiver_id == current_user.id)).all()
        users_list = User.query.filter(User.id != current_user.id).all()
        users = [user.to_dict() for user in users_list]

        for user in users:
            for friend in friends:
                if (friend.receiver_id == user['id'] or friend.sender_id == user['id']):
                    user['isFriend'] = friend.isFriend
                    user['sender_id'] = friend.sender_id
                    user['receiver_id'] = friend.receiver_id
                    user['friend_id'] = friend.id
                    user['refresh'] = True

        data['friends'] = users
        #  and user['id'] != current_user.id
        db.session.commit()

        return data
    return {'errors': ['Unauthorized']}


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        user = User.query.filter(User.email == form.data['email']).first()
        user.online = True
        # db.session.merge(user)
        # db.session.add(user)
        db.session.commit()
        login_user(user)

        server_users = ServerUser.query.filter(user.id == ServerUser.user_id).all()
        servers = [ Server.query.get(server.server_id) for server in server_users ]
        serverIds = [server.id for server in servers ]

        data = {
            'user': user.to_dict(),
            'servers': [ server.to_dict() for server in servers ],
            'friends': None,
        }

        for server in data['servers']:
            channel_list = Channel.query.filter(Channel.server_id == server['id']).all()
            server['channels'] = [ channel.to_dict() for channel in channel_list ]

            for channel in server['channels']:
                message_list = Message.query.filter(Message.channel_id == channel['id']).all()
                channel['messages'] = [ message.to_dict() for message in message_list ]

            user_id_list = ServerUser.query.filter(ServerUser.server_id == server['id']).all()
            users = []
            for server_user in user_id_list:
                user_list = User.query.filter(User.id == server_user.user_id).all()
                users.append( *[ user.to_dict() for user in user_list ] )
            server['users'] = users

            for user in users:
                roles = Role.query.select_from(UserRoles).filter(UserRoles.user_id == user['id']).all()
                if len(roles) > 0:
                    for role in roles:
                        if role.server_id == server['id']:
                            user['role'] = role.to_dict()
                            break

        friends = Friend.query.filter(or_(Friend.sender_id == user['id'], Friend.receiver_id == current_user.id)).all()
        users_list = User.query.filter(User.id != current_user.id).all()
        users = [ user.to_dict() for user in users_list ]

        for user in users:
            for friend in friends:
                if (friend.receiver_id == user['id'] or friend.sender_id == user['id']):
                    user['isFriend'] = friend.isFriend
                    user['sender_id'] = friend.sender_id
                    user['receiver_id'] = friend.receiver_id
                    user['friend_id'] = friend.id

        data['friends'] = users
        db.session.commit()
        emit('online', current_user.id, broadcast=True, namespace='/')

        return data
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    user = User.query.get(current_user.id)
    # User.query.filter(User.id == user.id).update({'online': False})
    user.online = False
    # db.session.merge(user)
    db.session.commit()
    logout_user()
    emit('log-out', user.to_dict(), broadcast=True, namespace='/')
    db.session.close()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    form = SignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        file = None
        if len(request.files) > 0:
			      file = request.files["file"]
			      file.filename = f'{file.filename}{randint(0, 1000000000000000000)}'


        if file:
          	file_url = upload_file_to_s3(file, Config.S3_BUCKET)
        else:
          	file_url = 'https://anarchybucket.s3.us-east-2.amazonaws.com/default.png'

        user = User(
            username=form.data['username'],
            email=form.data['email'],
            password=form.data['password'],
            profile_picture=file_url,
            createdAt=datetime.now()
        )
        db.session.add(user)
        db.session.commit()
        serverUser = ServerUser(
            user_id = User.query.filter(User.email == user.email).first().id,
            server_id = 1
        )
        db.session.add(serverUser)
        db.session.commit()

        queryUser = User.query.filter(User.email == user.email).first()
        data = {
            'user': queryUser.to_dict()
        }

        login_user(user)
        return data
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': ['Unauthorized']}, 401
