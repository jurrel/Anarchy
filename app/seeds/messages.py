from app.models import db, Message
from datetime import datetime

now = datetime.now()

def seed_messages():
  message1 = Message(
    message='hi!',
    user_id=6,
    receiver_id=None,
    channel_id=4,
    imageUrl=None,
    isRead=False,
    createdAt=now,
    updatedAt=now
  )

def undo_messages():
  db.session.execute('TRUNCATE messages RESTART IDENTITY CASCADE;')
  db.session.commit()
