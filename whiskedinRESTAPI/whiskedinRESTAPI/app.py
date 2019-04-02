import logging
from datetime import datetime

import bcrypt
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
cors = CORS(app, resources={r'/*': {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://flwxebtzpunihb:b2a44a6922588c' \
                                        'a95d9acae686c4604e5feffe421f4127a04812f942d11e29' \
                                        '5d@ec2-50-17-193-83.compute-1.amazonaws.com:5432/d5shgthfdb4nb0'
app.config['JWT_SECRET_KEY'] = 'verysecretkey'

db = SQLAlchemy(app)

jwt = JWTManager(app)


@app.route('/register', methods=['POST'])
def register_user():
    """
    POST:
        username
        password
    :return: json containing access_token if all goes well
    """
    print(request)
    print(request.form)
    username = request.form['username']
    password = request.form['password']

    if User.get_user(username):
        return jsonify(msg='username already exists'), 400

    User.create_user(username, password)
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


@app.route('/whiskies', methods=['GET', 'POST', 'PUT'])
@jwt_required
def whisky():
    '''
    GET
    returns list of whisky that belong to the user

    POST
    must send the required parameters
    returns the created whisky

    PUT
    must send the updated parameters and the wid
    returns the updated whisky
    '''
    username = get_jwt_identity()
    user = User.get_user(username)
    if request.method == 'GET':
        if 's' in request.args:
            s = request.args['s']
            whiskies = [whisk.build_dict() for whisk in Whisky.get_whiskies(s, user.uid)]
        else:
            whiskies = [whisk.build_dict() for whisk in user.whiskies]
        return jsonify(whiskies=whiskies)

    elif request.method == 'POST':
        form = request.json
        try:
            int(form['age'])
            int(form['rating'])
        except ValueError:
            return jsonify(msg='age and rating must be integers'), 400
        whisky = Whisky.create_whisky(form['name'], form['company'], form['type'], form['age'], form['origin'],
                                      form['flavor'], form['description'], form['rating'], user.uid)

        return jsonify(whisky=whisky.build_dict()), 201

    elif request.method == 'PUT':
        form = request.json
        updated_whisky = Whisky.update_whisky(form, user.uid)
        if updated_whisky is None:
            return jsonify(msg='Not your whisky to edit'), 403
        return jsonify(whisky=updated_whisky.build_dict()), 202


shared_whisky = db.Table('shared_whisky',
                         db.Column('shared_by', db.Integer, db.ForeignKey('user.uid')),
                         db.Column('shared_to', db.Integer, db.ForeignKey('user.uid')),
                         db.Column('wid', db.Integer, db.ForeignKey('whisky.wid')),
                         db.Column('shared_at', db.DateTime, default=datetime.utcnow))


class User(db.Model):
    uid = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=True, nullable=False)
    hashed_password = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    whiskies = db.relationship('Whisky', backref='user')

    def __init__(self, *args, **kwargs):
        super(User, self).__init__(*args, **kwargs)

    @staticmethod
    def get_user(username):
        if type(username) == int:
            user = User.query.filter_by(uid=username).first()
        else:
            user = User.query.filter_by(username=username).first()
        return user

    @staticmethod
    def create_user(username, password):
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        new_user = User(username=username, hashed_password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return new_user

    def build_dict(self):
        user = {
            'uid': self.uid,
            'username': self.username,
        }
        return user


class Whisky(db.Model):
    wid = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    origin = db.Column(db.String(40), nullable=False)
    flavor = db.Column(db.String(100), nullable=False)
    image = db.Column(db.Binary, nullable=True)
    description = db.Column(db.String(400), nullable=False)
    rating = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.Integer, db.ForeignKey(User.uid), nullable=False)

    @staticmethod
    def create_whisky(name, company, type, age, origin, flavor, description, rating, uid, image=None):
        new_whisky = Whisky(name=name, company=company, type=type, age=age, origin=origin, flavor=flavor, image=image,
                            description=description, rating=rating, created_by=uid)
        db.session.add(new_whisky)
        db.session.commit()
        return new_whisky

    @staticmethod
    def update_whisky(form, uid):
        whisky = Whisky.get_wisky(form['wid'])
        if whisky.created_by != uid:
            return None
        for key, value in form.items():
            whisky.__setattr__(key, value)
        db.session.commit()
        return whisky

    @staticmethod
    def get_wisky(wid):
        whisky = Whisky.query.filter_by(wid=wid).first()
        return whisky

    @staticmethod
    def get_whiskies(search, uid):
        search = '%' + search + '%'
        whiskies = Whisky.query.filter(Whisky.name.ilike(search) | Whisky.company.ilike(search) |
                                       Whisky.type.ilike(search) | Whisky.origin.ilike(search) |
                                       Whisky.flavor.ilike(search) |
                                       Whisky.description.ilike(search)).filter_by(created_by=uid)
        return whiskies

    def build_dict(self):
        whisk = {
            'wid': self.wid,
            'name': self.name,
            'company': self.company,
            'type': self.type,
            'age': self.age,
            'origin': self.origin,
            'flavor': self.flavor,
            'image': self.image if self.image else '',
            'description': self.description,
            'rating': self.rating,
            'created_at': self.created_at,
            'created_by': User.get_user(self.created_by).username
        }
        return whisk


if __name__ == '__main__':
    app.run()

