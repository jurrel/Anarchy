from app.models.user import User
from app.models import db, UserRoles

def seed_user_roles():
  demo1 = UserRoles(
    role_id=1, user_id=1,
  )
  demo2 = UserRoles(
    role_id=4, user_id=1,
  )
  demo3 = UserRoles(
    role_id=7, user_id=1,
  )


def undo_user_roles():
  db.session.execute('TRUNCATE user_roles RESTART IDENTITY CASCADE;')
  db.session.commit()
