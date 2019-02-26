import bcrypt
from flask import request, jsonify
from flask_jwt_extended import create_access_token

from whiskedinRESTAPI.models import User
from whiskedinRESTAPI.config import app


@app.route('/register', methods=['POST'])
def register_user():
    """
    POST:
        username
        password
    :return: json containing access_token if all goes well
    """

    username = request.form['username']
    password = request.form['password']

    if User.get_user(username):
        return jsonify(msg='username already exists'), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    User.create_user(username, hashed_password)
    token = create_access_token(identity=username)
    return jsonify(access_token=token), 201


@app.route('/login', methods=['POST'])
def login():
    """
    POST:
        username
        password
    :return: json containing access_token if all goes well
    """
    username = request.form['username']
    password = request.form['password']

    user = User.get_user(username)

    if user and bcrypt.checkpw(password.encode('utf-8'), user.hashed_password.encode('utf-8')):
        token = create_access_token(identity=username)
        return jsonify(access_token=token)
    else:
        return jsonify(msg='Invalid username or password'), 400



