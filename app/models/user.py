from .db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime

now = datetime.now()


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    profile_picture = db.Column(db.String(
        500), nullable=False, default='https://townsquare.media/site/694/files/2019/01/GettyImages-868643608.jpg')
    hashed_password = db.Column(db.String(255), nullable=False)
    online = db.Column(db.Boolean, default=False)
    createdAt = db.Column(db.DateTime, nullable=True)


    roles = db.relationship("Role", secondary='user_roles', back_populates="user")
    messages = db.relationship("Message", back_populates="user", foreign_keys='Message.user_id')
    private_messages = db.relationship("Message", back_populates="receiver", foreign_keys='Message.receiver_id')
    servers = db.relationship("Server", secondary="server_users", back_populates="user")
    server = db.relationship("Server", back_populates="owner")


    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email, 
            'profile_picture': self.profile_picture,
            'online': self.online 
        }
