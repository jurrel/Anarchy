from .db import db

class Friend(db.Model):
  __tablename__ = 'friends'

  id = db.Column(db.Integer, primary_key=True)
  sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
  receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
  isFriend = db.Column(db.Boolean, nullable=False, default=False)
  createdAt = db.Column(db.DateTime, nullable=False)
  updatedAt = db.Column(db.DateTime, nullable=False)

  def to_dict(self):
    return {
      'id': self.id,
      'sender_id': self.sender_id,
      'receiver_id': self.receiver_id,
      'isFriend': self.isFriend,
      'createdAt': self.createdAt.strftime("%Y/%m/%d %H:%M:%S"),
      'updatedAt': self.updatedAt.strftime("%Y/%m/%d %H:%M:%S")
    }
