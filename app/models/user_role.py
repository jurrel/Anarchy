from .db import db


class UserRoles(db.Model):
    __tablename__ = 'user_roles'

    id = db.Column(db.Integer, primary_key=True)
    role_id = db.Column('role_id', db.Integer, db.ForeignKey('roles.id'))
    user_id = db.Column('user_id', db.Integer, db.ForeignKey('users.id'))
   
  
    def to_dict():
        return {
            'id': self.id,
            'role_id': self.role_id,
            'user_id': self.user_id
        }

