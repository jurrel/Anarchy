from .db import db


class Message(db.Model):
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True) 
    message = db.Column(db.String(2000), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False) 
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False) 
    channel_id = db.Column(db.Integer, db.ForeignKey('channels.id'), nullable=False) 
    imageUrl = db.Column(db.String(500), nullable=True) 
    isRead = db.Column(db.Boolean, nullable=False, default=False)
    createdAt = db.Column(db.DateTime, nullable=False)
    updatedAt = db.Column(db.DateTime, nullable=False)
    
    channel = db.relationship("Channel", back_populates="messages") #roles can have many users, userse can have many roles
    user = db.relationship("User", back_populates="messages")

    def to_dict(self):
        return {
            'id': self.id,
            'message': self.message,
            'user_id': self.user_id,
            'receiver_id': self.receiver_id,
            'channel_id': self.channel_id,
            'imageUrl': self.imageUrl,
            'isRead': self.isRead,
            'createdAt': self.createdAt,
            'updatedAt': self.updatedAt
        }