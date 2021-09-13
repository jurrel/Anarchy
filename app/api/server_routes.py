from flask import Blueprint, request
from app.models import Server, db 

bp = Blueprint('server', __name__)

@server_route('/', method=['POST'])
def createServer():
    
