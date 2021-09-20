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
  welcome1 = ServerUser(
    user_id=2, server_id=1
  )
  welcome2 = ServerUser(
    user_id=3, server_id=1
  )
  welcome3 = ServerUser(
    user_id=4, server_id=1
  )
  welcome4 = ServerUser(
    user_id=5, server_id=1
  )
  welcome5 = ServerUser(
    user_id=6, server_id=1
  )
  user1 = ServerUser(
    user_id=1, server_id=4
  )
  user2 = ServerUser(
    user_id=2, server_id=4
  )
  user3 = ServerUser(
    user_id=3, server_id=4
  )
  user4 = ServerUser(
    user_id=4, server_id=4
  )
  user5 = ServerUser(
    user_id=5, server_id=4
  )
  user6 = ServerUser(
    user_id=6, server_id=4
  )
  user7 = ServerUser(
    user_id=1, server_id=5
  )
  user8 = ServerUser(
    user_id=2, server_id=5
  )
  user9 = ServerUser(
    user_id=3, server_id=5
  )
  user10 = ServerUser(
    user_id=4, server_id=5
  )
  user11 = ServerUser(
    user_id=5, server_id=5
  )
  user12 = ServerUser(
    user_id=6, server_id=5
  )
  user13 = ServerUser(
    user_id=1, server_id=6
  )
  user14 = ServerUser(
    user_id=2, server_id=6
  )
  user15 = ServerUser(
    user_id=3, server_id=6
  )
  user16 = ServerUser(
    user_id=4, server_id=6
  )
  user17 = ServerUser(
    user_id=5, server_id=6
  )
  user18 = ServerUser(
    user_id=6, server_id=6
  )
  user19 = ServerUser(
    user_id=1, server_id=7
  )
  user20 = ServerUser(
    user_id=2, server_id=7
  )
  user21 = ServerUser(
    user_id=3, server_id=7
  )
  user22 = ServerUser(
    user_id=4, server_id=7
  )
  user23 = ServerUser(
    user_id=5, server_id=7
  )
  user24 = ServerUser(
    user_id=6, server_id=7
  )
  
  
  db.session.add(demoMain)
  db.session.add(one)
  db.session.add(two)
  db.session.add(three)
  db.session.add(four)
  db.session.add(five)
  db.session.add(six)
  db.session.add(seven)
  db.session.add(eight)
  db.session.add(nine)
  db.session.add(ten)
  db.session.add(eleven)
  db.session.add(twelve)
  db.session.add(welcome1)
  db.session.add(welcome2)
  db.session.add(welcome3)
  db.session.add(welcome4)
  db.session.add(welcome5)

  db.session.commit()

def undo_server_users():
  db.session.execute('TRUNCATE server_users RESTART IDENTITY CASCADE;')
  db.session.commit()
