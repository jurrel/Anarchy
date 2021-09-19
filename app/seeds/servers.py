from app.models import db, Server
from datetime import datetime

now = datetime.now()

default_picture = 'https://mymusicdb.s3.us-east-2.amazonaws.com/anarchy/profiles/default.png'

def seed_servers():
  main = Server(
    name='Main', owner_id=1, imageUrl=default_picture, createdAt=now
  )
  cs = Server(
    name='CS:GO', owner_id=6, imageUrl=default_picture, createdAt=now
  )
  test = Server(
    name='Test', owner_id=4, imageUrl=default_picture, createdAt=now
  )
  smite = Server(
    name='Smite', owner_id=2, imageUrl=default_picture, createdAt=now 
  )

  db.session.add(main)
  db.session.add(cs)
  db.session.add(test)
  db.session.add(smite)

  db.session.commit()

def undo_servers():
  db.session.execute('TRUNCATE servers RESTART IDENTITY CASCADE;')
  db.session.commit()
