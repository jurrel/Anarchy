from app.models.server_user import ServerUser
from flask_socketio import SocketIO, send, join_room, leave_room, emit, disconnect
import os
from app.aws_s3 import upload_file_to_s3
from random import randint
from app.config import Config
# from flask_login import current_user

from .models import db, User, Message, Server, Channel, Friend, UserRoles, Role


# create your SocketIO instance
if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "http://anarchy.herokuapp.com",
        "https://anarchy.herokuapp.com"
    ]
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins=origins, manage_session=False)


from datetime import datetime

now = datetime.now()

#sockets

@socketio.on('connect')
def connection():
    print('Connection success!')

    @socketio.on('online')
    def login(userId):
        friends = Friend.query.filter(Friend.receiver_id == userId).all()
        print(friends)
        user = User.query.get(userId)
        print(user.to_dict())
        # # db.session.merge(user)
        user.online = True
        db.session.add(user)
        db.session.commit()
        emit('online', userId, broadcast=True, include_self=False)

    @socketio.on('confirm-friend')
    def confirm_friend(friend):
        print('CONFIRM FRIEND', friend)

        db_friend = Friend.query.get(friend['friend_id'])
        user = User.query.get(friend['receiver_id'])

        # db.session.commit()

        db_friend.isFriend = True
        friend['isFriend'] = True

        # db.session.merge(db_friend)
        db.session.add(db_friend)
        db.session.commit()
        # session.commit()

        emit('confirm-friend', friend, broadcast=True)
        return None

    @socketio.on('deny-friend')
    def deny_friend(friend):
        goodbye = Friend.query.filter(Friend.sender_id == friend['id']).one_or_none()

        db.session.delete(goodbye)
        # db.session.merge(goodbye)
        db.session.commit()
        print(friend)


        emit('deny-friend', friend, broadcast=True)
        return None

    @socketio.on('ruin-friendship')
    def ruin_friendship(friend):
        db_friend = Friend.query.get(friend['friend_id'])

        db.session.delete(db_friend)
        # # db.session.merge(db_friend)
        db.session.commit()
        print('WUT')

        emit('ruin-friendship', friend, broadcast=True)
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
        if len(data['file']):
            file_url = upload_file_to_s3(data['file'], Config.S3_BUCKET)
            # file = data['file']
            # file.filename = f'{file.filename}{randint(0, 1000000000000000000)}'
            server = Server(
                name=data['name'],
                owner_id=data['owner_id'],
                imageUrl=file_url,
                user_id=data['user_id'],
                server_id=data['server_id'],
                createdAt=now
            )
            # serveruser = ServerUser()
            # //
        else:
            server = Server(
                name=data['name'],
                owner_id=data['owner_id'],
                imageUrl=default_picture,
                user_id=data['user_id'],
                server_id=data['server_id'],
                createdAt=now
            )
            # serveruser = ServerUser(
            #     user_id = 
            # )
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
            print('ALREADY EXISTS')

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
        print(f'MSSSSSG{msg}')
        message = Message.query.get(msg['id'])
        message.message = msg['message']
        message.updatedAt = datetime.now()
        db.session.commit()
        emit('edit-message', broadcast=True)
        return None

    @socketio.on('del-message')
    def handleDeleteMessage(msgId):
        print('DELETE')
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
        print('MESSAGE PRIVATES', message.to_dict())
        db.session.add(message)
        # db.session.merge(message)
        db.session.commit()
        returnMessage = message.to_dict()
        send(returnMessage, broadcast=True)
        return None

    @socketio.on('typing')
    def typing_func(serverId):
        emit('typing', serverId, broadcast=True)
        return None

    @socketio.on('edit_profile')
    def edit_profile(data):
        print(data, 'DATAAAAA')
        pass

    @socketio.on('user-connected')
    def new_connection(serverId, senderId):
        print('NEW CONNECTION')
        return None

    @socketio.on('call')
    def broadcast_call(friend):
        print('CALL HAPPENING')
        emit('call', friend, broadcast=True)
        return None

    @socketio.on('answer')
    def answer_call(friend):
        print('ANSWERING CALL')
        emit('answer', broadcast=True, include_self=False)

    @socketio.on('join')
    def room(peerId):
        print('JOINING')
        emit('join', peerId, broadcast=True, include_self=False)
        return None

    @socketio.on('hang_up')
    def hang_up(peerId):
        print('LEAVING', peerId)
        emit('hang_up', peerId, broadcast=True)
        return None

    @socketio.on('search')
    def handle_search(query):
        servers = Server.query.filter(Server.name.op("~")(query)).all()
        returnServers = [ server.to_dict() for server in servers ]
        emit('search', returnServers, broadcast=True)

    @socketio.on('disconnect')
    def disconnection():
        print('Terminated connection')
        # emit('log-out', broadcast=True)
        return None
