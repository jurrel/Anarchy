from app.seeds.roles import seed_roles
from flask.cli import AppGroup
from .users import seed_users, undo_users
from .servers import seed_servers, undo_servers
from .roles import seed_roles, undo_roles
from .channels import seed_channels, undo_channels
from .server_users import seed_server_users, undo_server_users
from .user_roles import seed_user_roles, undo_user_roles
from .messages import seed_messages, undo_messages
from .friends import seed_friends, undo_friends

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    seed_users()
    # Add other seed functions here
    seed_servers()
    seed_roles()
    seed_channels()
    seed_server_users()
    seed_user_roles()
    seed_messages()
    seed_friends()


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    # Add other undo functions here
    undo_servers()
    undo_roles()
    undo_channels()
    undo_server_users()
    undo_user_roles()
    undo_messages()
    undo_friends()
