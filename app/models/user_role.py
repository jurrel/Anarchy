from .db import db


user_roles = db.Table(
    'user_roles', # name of table
    role_id = db.Column('role_id', db.Integer, db.ForeignKey('roles.id')),
    user_id = db.Column('user_id', db.Integer, db.ForeignKey('users.id'))
)
   
  
    

