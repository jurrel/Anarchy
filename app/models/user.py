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
    created_at = db.Column(
        db.String(), nullable=False, default=now.strftime("%d/%m/%Y %H:%M:%S"))

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
            'email': self.email
        }
