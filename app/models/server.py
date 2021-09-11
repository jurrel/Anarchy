from .db import db


class Server(db.Model):
    __tablename__ = 'servers'

    id = db.Column(db.Integer, primary_key=True) 
    name = db.Column(db.String(30), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False) 
    createdAt = db.Column(db.DateTime, nullable=False, default=db.func.now())

    role = db.relationship("Role", back_populates="server")
    channel = db.relationship("Channel", back_populates="server")
    user = db.relationship("User", secondary='server_users', back_populates="server") # not sure about this association
    # NOT SURE ABOUT THE SERVERS/USERS RELATIONSHIP SINCE SERVER
    #servers table is directly connected to users table
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'owner_id': self.owner_id,
            'createdAt': self.createdAt,
        }