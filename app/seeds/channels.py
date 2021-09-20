from app.models import db, Channel
from datetime import datetime

now = datetime.now()


def seed_channels():
  general1 = Channel(
    name='General', type=0, server_id=1, createdAt=now, updatedAt=now
  )
  test1 = Channel(
    name='Test', type=0, server_id=1, createdAt=now, updatedAt=now
  )
  voice1 = Channel(
    name='Hangout', type=1, server_id=1, createdAt=now, updatedAt=now
  )
  general2 = Channel(
    name='General', type=0, server_id=2, createdAt=now, updatedAt=now
  )
  voice2 = Channel(
    name='Stuff', type=1, server_id=2, createdAt=now, updatedAt=now
  )
  general3 = Channel(
    name="General", type=0, server_id=3, createdAt=now, updatedAt=now
  )
  voice3 = Channel(
    name="Random", type=0, server_id=3, createdAt=now, updatedAt=now
  )
  one = Channel(
    name="Gods", type=0, server_id=4, createdAt=now, updatedAt=now 
  )
  two = Channel(
    name="Conquest", type=0, server_id=4, createdAt=now, updatedAt=now 
  )
  three = Channel(
    name="General", type=0, server_id=5, createdAt=now, updatedAt=now 
  )
  four = Channel(
    name="Exotics", type=0, server_id=5, createdAt=now, updatedAt=now 
  )
  five = Channel(
    name='General', type=0, server_id=6, createdAt=now, updatedAt=now 
  )
  six = Channel(
    name='Casual', type=0, server_id=6, createdAt=now, updatedAt=now 
  )
  seven = Channel(
    name='Hang out lounge', type=0, server_id=7, createdAt=now, updatedAt=now 
  )
  eight = Channel(
    name='Study', type=0, server_id=7, createdAt=now, updatedAt=now 
  )

  db.session.add(general1)
  db.session.add(test1)
  db.session.add(voice1)
  db.session.add(general2)
  db.session.add(voice2)
  db.session.add(general3)
  db.session.add(voice3)
  db.session.add(one)
  db.session.add(two)
  db.session.add(three)
  db.session.add(four)
  db.session.add(five)
  db.session.add(six)
  db.session.add(seven)
  db.session.add(eight)

  db.session.commit()

def undo_channels():
  db.session.execute('TRUNCATE channels RESTART IDENTITY CASCADE;')
  db.session.commit()
