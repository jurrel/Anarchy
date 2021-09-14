from flask import Blueprint
from app.models import Channel, db
from app.forms.channel_form import ChannelForm

channel_route = Blueprint('channel', __name__)

@channel_route.route('/id', methods=["POST"])
def create_channel():
    form = ChannelForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        channel = Channel(
            name=form.name.data,
            type=form.type.data,
        )
        db.session.add(channel)
        db.session.commit()
        return channel.to_dict()
    return{'error': 'BIG OOOOOOOOOfff'}


@channel_route.route('/id', methods=["DELETE"])
def deleteChannel(id):
    channel = Channel.query.get(id)
    db.session.delete(channel)
    db.session.commit()

    return channel.to_dict()