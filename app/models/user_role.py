from .db import db


# user_roles = db.Table(
#     'user_roles', # name of table
#     db.Column('role_id', db.Integer, db.ForeignKey('roles.id')),
#     db.Column('user_id', db.Integer, db.ForeignKey('users.id'))
# )

class UserRoles(db.Model):
    __tablename__ = 'user_roles'

    id = db.Column(db.Integer, primary_key=True)
    role_id = db.Column('role_id', db.Integer, db.ForeignKey('roles.id'))
    user_id = db.Column('user_id', db.Integer, db.ForeignKey('users.id'))
   
  
    

