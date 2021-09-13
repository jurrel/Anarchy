from .db import db
from .user_role import user_roles


class Role(db.Model):
    __tablename__ = 'roles'

    id = db.Column(db.Integer, primary_key=True) 
    name = db.Column(db.String(30), nullable=False)
    perm_level = db.Column(db.Integer, nullable=False) 
    server_id = db.Column(db.Integer, db.ForeignKey('servers.id'), nullable=False) 

    users = db.relationship("User", secondary='user_roles', back_populates="roles") #roles can have many users, userse can have many roles
    server = db.relationship("Server", back_populates="roles")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'perm_level': self.perm_level,
            'server_id': self.server_id,
        }