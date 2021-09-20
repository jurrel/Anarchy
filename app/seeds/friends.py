from app.models import db, Friend
from datetime import datetime

now = datetime.now()

def seed_friends():
  friend_req_1 = Friend(
    sender_id=4,
    receiver_id=1,
    isFriend=False,
    createdAt=now,
    updatedAt=now
  )
  friend_req_2 = Friend(
    sender_id=2,
    receiver_id=1,
    isFriend=False,
    createdAt=now,
    updatedAt=now
  )
  friend_req_3 = Friend(
    sender_id=3,
    receiver_id=1,
    isFriend=False,
    createdAt=now,
    updatedAt=now
  )
  friend_req_4 = Friend(
    sender_id=6,
    receiver_id=1,
    isFriend=False,
    createdAt=now,
    updatedAt=now
  )
  friend_req_5 = Friend(
    sender_id=5,
    receiver_id=1,
    isFriend=False,
    createdAt=now,
    updatedAt=now
  )
  friend = Friend(
    sender_id=4,
    receiver_id=5,
    isFriend=True,
    createdAt=now,
    updatedAt=now
  )
  friend1 = Friend(
    sender_id=4,
    receiver_id=6,
    isFriend=True,
    createdAt=now,
    updatedAt=now
  )
  friend2 = Friend(
    sender_id=5,
    receiver_id=6,
    isFriend=True,
    createdAt=now,
    updatedAt=now
  )

  db.session.add(friend)
  db.session.add(friend1)
  db.session.add(friend2)
  db.session.add(friend_req_1)
  db.session.add(friend_req_2)
  db.session.add(friend_req_3)
  db.session.add(friend_req_4)
  db.session.add(friend_req_5)

  db.session.commit()

def undo_friends():
  db.session.execute('TRUNCATE friends RESTART IDENTITY CASCADE;')
  db.session.commit()
