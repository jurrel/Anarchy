from .db import db


class ServerUser(db.Model):
    __tablename__ = 'server_users'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column('user_id', db.Integer, db.ForeignKey('users.id'))
    server_id = db.Column('server_id', db.Integer, db.ForeignKey('servers.id'))
