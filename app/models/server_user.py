from .db import db


# server_users = db.Table(
#     'server_users', # name of table
#     db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
#     db.Column('server_id', db.Integer, db.ForeignKey('servers.id'))
# )

class ServerUser(db.Model):
    __tablename__ = 'server_users'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column('user_id', db.Integer, db.ForeignKey('users.id'))
    server_id = db.Column('server_id', db.Integer, db.ForeignKey('servers.id'))
