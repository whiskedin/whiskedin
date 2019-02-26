import unittest

from app import db, app


class BasicTests(unittest.TestCase):
    TEST_DB = 'test.db'

    ############################
    #### setup and teardown ####
    ############################

    # executed prior to each test
    def setUp(self):
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        app.config['DEBUG'] = False
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + self.TEST_DB
        self.app = app.test_client()
        db.drop_all()
        db.create_all()

    def test_login(self):
        response = self.app.post('/register', data={'username': 'huh', 'password': 'pass'})
        print('bop')
