from app.models import channel, db, Message
from datetime import datetime
from random import randint

now = datetime.now()

def generateMessages(num_messages = 200):
  num_users=6
  num_channels=7

  for i in range(1, num_messages):
    temp = Message(
      message=f'hi {randint(1, 1000000)}',
      user_id=randint(1, num_users),
      receiver_id=None,
      channel_id=randint(1, num_channels),
      imageUrl=None,
      isRead=False,
      createdAt=now,
      updatedAt=now
    )
    db.session.add(temp)


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
  message2 = Message(
    message="Lorem ipsum dolor sit amet.",
    user_id=6,
    receiver_id=None,
    channel_id=4,
    imageUrl=None,
    isRead=False,
    createdAt=now,
    updatedAt=now
  )

  generateMessages(200)

  db.session.add(message1)
  db.session.add(message2)


  db.session.commit()

def undo_messages():
  db.session.execute('TRUNCATE messages RESTART IDENTITY CASCADE;')
  db.session.commit()
