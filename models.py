from datetime import datetime

from config import db


class User(db.Model):
    uid = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=True, nullable=False)
    hashed_password = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    db.relationship('Whisky', backref='user')


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
    created_by = db.Column(db.Integer, db.ForeignKey('User.uid'), nullable=False)
