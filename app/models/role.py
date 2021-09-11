from .db import db


class Role(db.Model):
    __tablename__ = 'roles'

    id = db.Column(db.Integer, primary_key=True) 
    name = db.Column(db.String(30), nullable=False)
    perm_level = db.Column(db.Integer, nullable=False) 
    server_id = db.Column(db.Integer, db.ForeignKey('servers.id'), nullable=False) 

    users = db.relationship("User", secondary='user_roles', back_populates="role")
    server = db.relationship("Server", back_populates="role")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'perm_level': self.perm_level,
            'server_id': self.server_id,
        }