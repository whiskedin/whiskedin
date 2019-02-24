from flask import Flask
from flask_testing import TestCase

from config import db


class LoginRegisterTest(TestCase):

    DATABASE_URI = "sqlite://"

    def create_app(self):
        app = Flask(__name__)
        app.config['TESTING'] = True
        return app

    def setUp(self):
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
