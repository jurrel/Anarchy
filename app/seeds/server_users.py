from app.models import db, ServerUser

def seed_server_users():
  demoMain = ServerUser(
    user_id=1, server_id=1
  )
  one = ServerUser(
    user_id=1, server_id=2
  )
  two = ServerUser(
    user_id=2, server_id=2
  )
  three = ServerUser(
    user_id=3, server_id=2
  )
  four = ServerUser(
    user_id=4, server_id=2
  )
  five = ServerUser(
    user_id=5, server_id=2
  )
  six = ServerUser(
    user_id=6, server_id=2
  )
  seven = ServerUser(
    user_id=1, server_id=3
  )
  eight = ServerUser(
    user_id=2, server_id=3
  )
  nine = ServerUser(
    user_id=3, server_id=3
  )
  ten = ServerUser(
    user_id=4, server_id=3
  )
  eleven = ServerUser(
    user_id=5, server_id=3
  )
  twelve = ServerUser(
    user_id=6, server_id=3
  )

def undo_server_users():
  db.session.execute('TRUNCATE server_users RESTART IDENTITY CASCADE;')
  db.session.commit()
