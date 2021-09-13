from app.models import db, User
from datetime import datetime 

now = datetime.now()


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo', email='demo@aa.io', password='password', createdAt=now)
    marnie = User(
        username='marnie', email='marnie@aa.io', password='password', createdAt=now)
    bobbie = User(
        username='bobbie', email='bobbie@aa.io', password='password', createdAt=now)

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_users():
    db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
    db.session.commit()
