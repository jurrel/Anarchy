from app.models import db, Friend
from datetime import datetime

def seed_friends():
  friend_req_1 = Friend(
    sender_id=4,
    receiver_id=1,
    isFriend=False,
    createdAt=datetime.now(),
    updatedAt=datetime.now()
  )
  friend_req_2 = Friend(
    sender_id=2,
    receiver_id=1,
    isFriend=False,
    createdAt=datetime.now(),
    updatedAt=datetime.now()
  )
  friend_req_3 = Friend(
    sender_id=3,
    receiver_id=1,
    isFriend=False,
    createdAt=datetime.now(),
    updatedAt=datetime.now()
  )
  friend_req_4 = Friend(
    sender_id=6,
    receiver_id=1,
    isFriend=False,
    createdAt=datetime.now(),
    updatedAt=datetime.now()
  )
  friend_req_5 = Friend(
    sender_id=5,
    receiver_id=1,
    isFriend=False,
    createdAt=datetime.now(),
    updatedAt=datetime.now()
  )

  db.session.add(friend_req_1)
  db.session.add(friend_req_2)
  db.session.add(friend_req_3)
  db.session.add(friend_req_4)
  db.session.add(friend_req_5)

  db.session.commit()

def undo_friends():
  db.session.execute('TRUNCATE friends RESTART IDENTITY CASCADE;')
  db.session.commit()
