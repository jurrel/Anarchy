from app.models import channel, db, Message
from datetime import datetime
from random import randint

now = datetime.now()

def generateMessages(num_messages = 200):
  num_users=6
  num_channels=7

  for i in range(1, num_messages):
    temp = Message(
      message=f'hi {randint(1, 1000000)}',
      user_id=randint(1, num_users),
      receiver_id=None,
      channel_id=randint(1, num_channels),
      imageUrl=None,
      isRead=False,
      createdAt=now,
      updatedAt=now
    )
    db.session.add(temp)


def seed_messages():
  message1 = Message(
    message='hi!',
    user_id=6,
    receiver_id=None,
    channel_id=4,
    imageUrl=None,
    isRead=False,
    createdAt=now,
    updatedAt=now
  )
  message2 = Message(
    message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl nunc mi ipsum faucibus vitae. Nascetur ridiculus mus mauris vitae. Nunc vel risus commodo viverra maecenas accumsan lacus vel. Justo nec ultrices dui sapien eget mi proin sed libero. Elementum tempus egestas sed sed risus pretium quam. Pretium quam vulputate dignissim suspendisse in est ante in nibh. Interdum varius sit amet mattis vulputate enim nulla aliquet porttitor. Mattis nunc sed blandit libero. Non tellus orci ac auctor augue mauris augue. At tellus at urna condimentum mattis pellentesque. Nunc mi ipsum faucibus vitae aliquet nec ullamcorper. Quam elementum pulvinar etiam non quam lacus. Dignissim sodales ut eu sem integer vitae justo eget magna. Lectus mauris ultrices eros in cursus turpis massa tincidunt. Vitae et leo duis ut diam quam nulla. Elementum curabitur vitae nunc sed velit dignissim. Molestie ac feugiat sed lectus vestibulum mattis. Etiam erat velit scelerisque in. Penatibus et magnis dis parturient. Sit amet venenatis urna cursus eget nunc scelerisque viverra. Amet venenatis urna cursus eget nunc. Id aliquet risus feugiat in ante. Tellus cras adipiscing enim eu turpis egestas. Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus et netus. Hendrerit dolor magna eget est lorem ipsum dolor sit. Sit amet venenatis urna cursus eget nunc scelerisque viverra mauris. Nulla facilisi nullam vehicula ipsum a arcu. Purus gravida quis blandit turpis cursus in. Nibh mauris cursus mattis molestie a iaculis at erat pellentesque. Tincidunt augue interdum velit euismod in pellentesque massa. Turpis nunc eget lorem dolor. A diam sollicitudin tempor id eu. Ultrices dui sapien eget mi proin sed. Auctor augue mauris augue neque gravida in fermentum. Luctus accumsan tortor posuere ac ut consequat semper viverra nam.",
    user_id=6,
    receiver_id=None,
    channel_id=4,
    imageUrl=None,
    isRead=False,
    createdAt=now,
    updatedAt=now
  )

  generateMessages(200)

  db.session.add(message1)
  db.session.add(message2)


  db.session.commit()

def undo_messages():
  db.session.execute('TRUNCATE messages RESTART IDENTITY CASCADE;')
  db.session.commit()
