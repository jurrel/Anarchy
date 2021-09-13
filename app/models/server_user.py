from .db import db


server_users = db.Table(
    'server_users', # name of table
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('server_id', db.Integer, db.ForeignKey('servers.id'))
)
