from flask import Blueprint, request
from app.models import Server, db
from app.forms.server_form import ServerForm

server_route = Blueprint('server', __name__)


@server_route.route('/id', methods=["POST"])
def create_server():
    form = ServerForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        server = Server(
            name=form.name.data,
            imageUrl=form.imageUrl.data,
            mediaId=form.mediaId.data
        )
        db.session.add(server)
        db.session.commit()
        return server.to_dict()
    return{'error': 'BIG OOOOOOOOOfff'}


@server_route.route('/', methods=["DELETE"])
def deleteServer(id):
    server = Server.query.get(id)
    db.session.delete(server)
    db.session.commit()

    return server.to_dict()
