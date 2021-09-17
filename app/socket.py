from flask_socketio import SocketIO, send, join_room, leave_room, emit, disconnect
import os
# from flask_login import current_user

from .models import db, User, Message, Server, Channel, Friend


# create your SocketIO instance
if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "http://actual-app-url.herokuapp.com",
        "https://actual-app-url.herokuapp.com"
    ]
else:
    origins = "*"

# create your SocketIO instance
socketio = SocketIO(cors_allowed_origins=origins)


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
        print(f'{message.to_dict()}\n\n\n\n\n\n\n\n')
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
        return None 

    @socketio.on('call')
    def broadcast_call(peerId):
        print('CALL HAPPENING')
        emit('join', peerId, broadcast=True, include_self=False)
        return None 

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

    @socketio.on('disconnect')
    def disconnection():
        print('Terminated connection')
        # emit('log-out', broadcast=True)
        return None
