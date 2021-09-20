from app.models.server_user import ServerUser
from flask_socketio import SocketIO, send, join_room, leave_room, emit, disconnect
import os
from app.aws_s3 import upload_file_to_s3
from random import randint
from app.config import Config
from sqlalchemy import or_


from .models import db, User, Message, Server, Channel, Friend, UserRoles, Role


# create your SocketIO instance
if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "http://anarchy-app.herokuapp.com",
        "https://anarchy-app.herokuapp.com"
    ]
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins=origins, manage_session=False)


from datetime import datetime

now = datetime.now()

#sockets

@socketio.on('connect')
def connection():

    @socketio.on('online')
    def login(userId):
        friends = User.query.filter(User.id == userId).all()
        user = User.query.get(userId)

        user.online = True
        db.session.add(user)
        db.session.commit()
        emit('online', userId, broadcast=True)
        return None 

    @socketio.on('confirm-friend')
    def confirm_friend(friend):

        db_friend = Friend.query.get(friend['friend_id'])
        user = User.query.get(friend['receiver_id'])

        db_friend.isFriend = True

        db.session.add(db_friend)
        db.session.commit()

        friend['isFriend'] = True

        emit('confirm-friend', friend, broadcast=True)
        return None

    @socketio.on('deny-friend')
    def deny_friend(friend):
        goodbye = Friend.query.filter(Friend.sender_id == friend['id']).one_or_none()

        db.session.delete(goodbye)
        db.session.commit()

        emit('deny-friend', friend, broadcast=True)
        return None

    @socketio.on('ruin-friendship')
    def ruin_friendship(friend):
        db_friend = Friend.query.get(friend['friend_id'])

        db.session.delete(db_friend)
        db.session.commit()

        emit('ruin-friendship', friend, broadcast=True)
        return None
    
    @socketio.on('search-friend')
    def search_friend(name):
        user_list = User.query.filter(User.username.op("~")(name)).all()
        id_list = [ user.id for user in user_list ]

        friends = Friend.query.filter(Friend.sender_id not in id_list).filter(Friend.receiver_id not in id_list).all()
        users = [ user.to_dict() for user in user_list ]

        for user in users:
            for friend in friends:
                if friend.sender_id == user['id'] or friend.receiver_id == user['id']:
                    user['isFriend'] = friend.isFriend
                    user['sender_id'] = friend.sender_id
                    user['receiver_id'] = friend.receiver_id
                    user['friend_id'] = friend.id
                    user['messages'] = []

        
        emit('search-friend', users, broadcast=True)
        return None 

    @socketio.on('add-friend')
    def add_friend(data):
        pending = Friend.query.filter(Friend.sender_id == data['sender_id']).filter(Friend.receiver_id == data['receiver_id']).all()
        
        if not pending:
            friend = Friend(
                sender_id=data['sender_id'],
                receiver_id=data['receiver_id'],
                createdAt=now,
                updatedAt=now
            )

        db.session.add(friend)
        db.session.commit()

        user = User.query.filter(User.id == friend.sender_id).one_or_none()
        user = user.to_dict()
        user['sender_id'] = friend.sender_id
        user['receiver_id'] = friend.receiver_id 
        user['isFriend'] = False 
        

        emit('add-friend', user, broadcast=True)
        return None 


    @socketio.on('edit-server')
    def edit_server(data):
        server = Server.query.get(data.id)
        server.name = data.name
        server.imageUrl = data.imageUrl
        db.session.commit()
        emit('edit-server', server.to_dict(), broadcast=True)
        return None


    @socketio.on('new-server')
    def new_server(data):
        default_picture = 'https://mymusicdb.s3.us-east-2.amazonaws.com/anarchy/profiles/default.png'
        if len(data['imageUrl']):
            server = Server(
                name=data['name'],
                owner_id=data['owner_id'],
                imageUrl=data['imageUrl'],
                createdAt=now
            )
        else: 
            server = Server(
                name=data['name'],
                owner_id=data['owner_id'],
                imageUrl=default_picture,
                createdAt=now
            )
        db.session.add(server)
        db.session.commit()
        emit('new-server', server.to_dict(), broadcast=True)
        return None

    @socketio.on('join-server')
    def join_server(data):

        exists = ServerUser.query.filter(ServerUser.user_id == data['user_id']).filter(ServerUser.server_id == data['server_id']).one_or_none()

        if not exists:
            server_user = ServerUser(
                user_id=data['user_id'],
                server_id=data['server_id']
            )
            db.session.add(server_user)
            db.session.commit()

            server_obj = Server.query.get(data['server_id'])
            server = server_obj.to_dict()
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
            server['join-user'] = data['user_id']

            for person in users:
                roles = Role.query.select_from(UserRoles).filter(UserRoles.user_id == person['id']).all()
                if len(roles) > 0:
                    for role in roles:
                        if role.server_id == server['id']:
                            person['role'] = role.to_dict()
                            break
            emit('join-server', server)
        else:
            pass 

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
        message = Message(
                message = msg['message'],
                user_id = msg['user_id'],
                channel_id = msg['channel_id'],
                imageUrl = None,
                createdAt = datetime.now(),
                updatedAt = datetime.now()
        )
        db.session.add(message)
        db.session.commit()
        returnMessage = message.to_dict()
        send(returnMessage, broadcast=True)
        return None

    @socketio.on('edit-message')
    def editMessage(msg):
        message = Message.query.get(msg['id'])
        message.message = msg['message']
        message.updatedAt = datetime.now()
        db.session.commit()
        emit('edit-message', broadcast=True)
        return None

    @socketio.on('del-message')
    def handleDeleteMessage(msgId):
        message = Message.query.get(msgId)
        db.session.delete(message)
        db.session.commit()
        emit('delete-message', msgId, broadcast=True)
        return None

    @socketio.on('private-message')
    def handlePrivateMessage(msg):
        message = Message(
            message=msg['message'],
            user_id=msg['user_id'],
            receiver_id=msg['receiver_id'],
            createdAt = now,
            updatedAt = now
        )
        
        db.session.add(message)
        db.session.commit()
        returnMessage = message.to_dict()
        emit('private-message', returnMessage, broadcast=True)
        return None

    @socketio.on('typing')
    def typing_func(serverId):
        emit('typing', serverId, broadcast=True)
        return None

    @socketio.on('edit_profile')
    def edit_profile(data):
        pass

    @socketio.on('user-connected')
    def new_connection(serverId, senderId):
        return None

    @socketio.on('call')
    def broadcast_call(friend):
        emit('call', friend, broadcast=True)
        return None

    @socketio.on('answer')
    def answer_call(friend):
        emit('answer', broadcast=True, include_self=False)

    @socketio.on('join')
    def room(peerId):
        emit('join', peerId, broadcast=True, include_self=False)
        return None

    @socketio.on('hang_up')
    def hang_up(peerId):
        emit('hang_up', peerId, broadcast=True)
        return None

    @socketio.on('search')
    def handle_search(query):
        servers = Server.query.filter(Server.name.op("~")(query)).all()
        returnServers = [ server.to_dict() for server in servers ]
        emit('search', returnServers, broadcast=True)

    @socketio.on('disconnect')
    def disconnection():
        return None
