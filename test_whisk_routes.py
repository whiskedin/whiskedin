from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_testing import TestCase

from config import db


class LoginRegisterTest(TestCase):

    DATABASE_URI = "sqlite:////tmp/test.db"
    db = None

    def create_app(self):
        app = Flask(__name__)
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = self.DATABASE_URI
        self.db = SQLAlchemy(app)

        return app

    def setUp(self):
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_(self):
        self.assertEqual(None, None)
