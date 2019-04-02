import unittest

import bcrypt

from whiskedinRESTAPI.whiskedinRESTAPI.app import db, app, User, Whisky


class WhiskedTest(unittest.TestCase):

    TEST_DB = 'test.db'

    def setUp(self):
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        app.config['DEBUG'] = False
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + self.TEST_DB
        self.app = app.test_client()
        db.drop_all()
        db.create_all()
        self.user = self.create_test_user()
        self.headers = {'Content-Type': 'application/json'}
        self.whisky_dict = {
            'name': 'name',
            'company': 'company',
            'type': 'type',
            'age': 12,
            'origin': 'origin',
            'flavor': 'flavor',
            'description': 'description',
            'rating': 5,
            'created_by': self.user.uid
        }

    def tearDown(self):
        db.drop_all()
        db.create_all()

    def create_test_user(self, username='username', database=db):
        password = 'password'
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        user = User(username=username, hashed_password=hashed_password)
        database.session.add(user)
        database.session.commit()
        return user

    def create_test_whisky(self, uid=1, whisky=None, database=db):
        if whisky is None:
            whisky = self.whisky_dict
        whisky_to_create = whisky.copy()
        if uid != 1:
            whisky_to_create['created_by'] = uid
        whisky = Whisky(**whisky_to_create)
        database.session.add(whisky)
        database.session.commit()
        return whisky

