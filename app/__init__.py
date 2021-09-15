import os
from flask import Flask, render_template, request, session, redirect
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager, current_user
from flask_socketio import SocketIO, send, join_room, leave_room, emit
from sqlalchemy import or_
from operator import or_
import json





from .models import db, User, Message, Server, Channel, Friend
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.server_routes import server_route  ###
from .api.channel_routes import channel_route  ###

from .seeds import seed_commands


from .config import Config

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Setup login manager
login = LoginManager(app)
login.login_view = 'auth.unauthorized'


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


# Tell flask about our seed commands
app.cli.add_command(seed_commands)

app.config.from_object(Config)
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(server_route, url_prefix='/api/servers')  ###
app.register_blueprint(channel_route, url_prefix='/api/channel')  ###

db.init_app(app)
Migrate(app, db)

# Application Security
CORS(app)


# Since we are deploying with Docker and Flask,
# we won't be using a buildpack when we deploy to Heroku.
# Therefore, we need to make sure that in production any
# request made over http is redirected to https.
# Well.........
@app.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            code = 301
            return redirect(url, code=code)


@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
        samesite='Strict' if os.environ.get(
            'FLASK_ENV') == 'production' else None,
        httponly=True)
    return response


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    if path == 'favicon.ico':
        return app.send_static_file('favicon.ico')
    return app.send_static_file('index.html')



from datetime import datetime

now = datetime.now()

#sockets

@socketio.on('connect')
def connection():
    print('Connection success!')

    @socketio.on('online')
    def login(userId):
        emit('online', userId, broadcast=True, include_self=False)

    @socketio.on('confirm-friend')
    def confirm_friend(sender_id, receiver_id):

        friend = Friend.query.filter(Friend.receiver_id == receiver_id).filter(Friend.sender_id == sender_id).one_or_none()
        if friend:
            friend.isFriend = True
        db.session.commit()
        data = {
            'sender_id': sender_id,
            'receiver_id': receiver_id
        }
        emit('friend-confirmed', data, broadcast=True)
        return None

    @socketio.on('edit-server')
    def edit_server(data):
        server = Server.query.get(data.id)
        server.name = data.name
        server.imageUrl = data.imageUrl
        db.session.commit()
        emit('edit-server', server.to_dict(), broadcast=True)
        return None

    @socketio.on('delete-server')
    def delete_server(id):
        server = Server.query.get(id)
        db.session.delete(server)
        db.session.commit()
        emit('delete-server', id, broadcast=True)
        return None

    @socketio.on('post-channel')
    def post_channel(data):
        channel = Channel(
            name = data.name,
            type = data.type,
            server_id = data.server_id,
            createdAt = now,
            updatedAt = now
        )
        db.session.add(channel)
        db.session.commit()
        emit('post-channel', channel.to_dict(), broadcast=True)
        return None

    @socketio.on('edit-channel')
    def edit_channel(data):
        channel = Channel.query.get(data.id)
        channel.name = data.name
        channel.updatedAt = now
        db.session.commit()
        emit('edit-channel', channel.to_dict(), broadcast=True)

    @socketio.on('delete-channel')
    def delete_channel(id):
        channel = Channel.query.get(id)
        db.session.delete(channel)
        db.session.commit()
        emit('delete-channel', id, broadcast=True)
        return None

    @socketio.on('message')
    def handleMessage(msg):
        print('MESSAGE')
        message = Message(
                message = msg['message'],
                user_id = msg['user_id'],
                channel_id = msg['channel_id'],
                imageUrl = None,
                createdAt = now,
                updatedAt = now
        )
        db.session.add(message)
        db.session.commit()
        returnMessage = message.to_dict()
        send(returnMessage, broadcast=True)
        return None

    @socketio.on('private-message')
    def handlePrivateMessage(msg):

        if msg.has_key('imageUrl'):
            message = Message(
                message=msg['message'],
                user_id=msg['user_id'],
                receiver_id=msg['receiver_id'],
                channel_id=msg['channel_id'],
                imageUrl=msg['imageUrl'],
                createdAt = now,
                updatedAt = now
            )
        else:
            message = Message(
                message=msg['message'],
                user_id=msg['user_id'],
                receiver_id=msg['receiver_id'],
                createdAt = now,
                updatedAt = now
            )
        returnMessage = message.to_dict()
        send(returnMessage, broadcast=True)
        return None

    @socketio.on('typing')
    def typing_func(serverId):
        emit('typing', serverId, broadcast=True)
        return None

    @socketio.on('user-connected')
    def new_connection(serverId, senderId):
        print('NEW CONNECTION')

    @socketio.on('join')
    def room(peerId):
        print('JOINING')
        emit('join', peerId, broadcast=True, include_self=False)
        return None

    @socketio.on('hang_up')
    def hang_up(serverId, userId):
        print('LEAVING', serverId, userId)
        room = serverId
        leave_room(room)
        data = {'userId': userId, 'roomId': serverId}
        emit('hang_up', data, broadcast=True)
        return None

    @socketio.on('disconnect')
    def disconnection():
        print('Terminated connection')
        return None
