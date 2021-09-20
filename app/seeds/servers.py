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
  destiny = Server(
    name='Destiny2', owner_id=2, imageUrl='https://cdn.akamai.steamstatic.com/steam/apps/1085660/header.jpg?t=1631638993', createdAt=now
  )
  dota2 = Server(
    name='Dota2', owner_id=3, imageUrl='https://upload.wikimedia.org/wikipedia/en/0/0b/Dota_2_%28Steam_2019%29.jpg', createdAt=now 
  )
  aa = Server(
    name='AA May Cohort', owner_id=1, imageUrl='https://image.shutterstock.com/image-photo/two-young-businesspeople-sitting-table-260nw-315652508.jpg', createdAt=now
  )

  db.session.add(main)
  db.session.add(cs)
  db.session.add(test)
  db.session.add(smite)
  db.session.add(destiny)
  db.session.add(dota2)
  db.session.add(aa)

  db.session.commit()

def undo_servers():
  db.session.execute('TRUNCATE servers RESTART IDENTITY CASCADE;')
  db.session.commit()
