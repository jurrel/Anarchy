from app.models import db, Role

def seed_roles():
  moderator1 = Role(
    name="Moderator", perm_level=3, server_id=1
  )
  guest1 = Role(
    name="Guest", perm_level=1, server_id=1
  )
  unverified1 = Role(
    name="Unverified", perm_level=0, server_id=1
  )
  moderator2 = Role(
    name="Moderator", perm_level=3, server_id=2
  )
  guest2 = Role(
    name="Guest", perm_level=1, server_id=2
  )
  unverified2 = Role(
    name="Unverified", perm_level=0, server_id=2
  )
  moderator3 = Role(
    name="Moderator", perm_level=3, server_id=3
  )
  guest3 = Role(
    name="Guest", perm_level=1, server_id=3
  )
  unverified3 = Role(
    name="Unverified", perm_level=0, server_id=3
  )

  db.session.add(moderator1)
  db.session.add(moderator2)
  db.session.add(moderator3)
  db.session.add(guest1)
  db.session.add(guest2)
  db.session.add(guest3)
  db.session.add(unverified1)
  db.session.add(unverified2)
  db.session.add(unverified3)

  db.session.commit()

def undo_roles():
  db.session.execute('TRUNCATE roles RESTART IDENTITY CASCADE;')
  db.session.commit()
