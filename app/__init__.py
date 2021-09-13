import os
from flask import Flask, render_template, request, session, redirect
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager
from flask_socketio import SocketIO, send, join_room, leave_room, emit



from .models import db, User, Message
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



@socketio.on('connect')
def connection():
    print('Connection success!')

    @socketio.on('message')
    def handleMessage(msg):
        print('MESSAGE')
        if msg.imageUrl:
            message = Message(
                message=msg['message'], 
                user_id=msg['user_id'],
                receiver_id=msg['receiver_id'],
                channel_id=msg['channel_id'],
                imageUrl=msg['imageUrl']
            )
        else:
            message = Message(
                message=msg['message'],
                user_id=msg['user_id'],
                receiver_id=msg['receiver_id'],
                channel_id=msg['channel_id']
            )
        db.session.add(message)
        db.session.commit()
        returnMessage = {'id': message.id,
                         'message': message.message,
                         'person_id': message.person_id,
                         'server_id': message.server_id}
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
