
from .db import db


class Channel(db.Model):
    __tablename__ = 'channels'

    id = db.Column(db.Integer, primary_key=True) 
    name = db.Column(db.String(30), nullable=False)
    type = db.Column(db.Integer, nullable=False)
    server_id = db.Column(db.Integer, db.ForeignKey("servers.id"), nullable=False)
    createdAt = db.Column(db.DateTime, nullable=False, default=db.func.now())
    updatedAt = db.Column(db.DateTime, nullable=False, default=db.func.now(), onupdate=db.func.now())

    server = db.relationship("Server", back_populates="channel")
    message = db.relationship("Message", back_populates="channel")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'server_id': self.server_id,
            'createdAt': self.createdAt,
        }