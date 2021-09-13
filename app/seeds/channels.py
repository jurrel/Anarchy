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
    name='General Voice', type=1, server_id=1, createdAt=now, updatedAt=now
  )
  general2 = Channel(
    name='General', type=0, server_id=2, createdAt=now, updatedAt=now
  )
  voice2 = Channel(
    name='General Voice', type=1, server_id=2, createdAt=now, updatedAt=now
  )
  general3 = Channel(
    name="General", type=0, server_id=3, createdAt=now, updatedAt=now
  )
  voice3 = Channel(
    name="Voice Chat", type=0, server_id=3, createdAt=now, updatedAt=now
  )

def undo_channels():
  db.session.execute('TRUNCATE channels RESTART IDENTITY CASCADE;')
  db.session.commit()
