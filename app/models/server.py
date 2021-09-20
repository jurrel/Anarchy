from .db import db


class Server(db.Model):
    __tablename__ = 'servers'

    id = db.Column(db.Integer, primary_key=True) 
    name = db.Column(db.String(30), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    imageUrl = db.Column(db.String(500), nullable=True) 
    createdAt = db.Column(db.DateTime, nullable=False)

    roles = db.relationship("Role", back_populates="server")
    channels = db.relationship("Channel", back_populates="server")
    user = db.relationship("User", secondary='server_users', back_populates="servers")
    owner = db.relationship("User", back_populates="server") 


    def to_dict(self): 
        return {
            'id': self.id,
            'name': self.name,
            'owner_id': self.owner_id,
            'imageUrl': self.imageUrl,
            'createdAt': self.createdAt.strftime("%Y/%m/%d %H:%M:%S"),
        }