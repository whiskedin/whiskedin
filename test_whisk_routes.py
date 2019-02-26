import unittest

from app import db, app, User


class UserTests(unittest.TestCase):
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

    def test_get_user_empty(self):
        username = 'username'
        user = User.get_user(username)
        self.assertEqual(None, user)

    def test_get_user_exists(self):
        user_to_add = User(username='username', hashed_password='password')
        db.session.add(user_to_add)
        db.session.commit()
        user = User.get_user('username')
        self.assertIsNotNone(user)
        self.assertEqual(user.username, 'username')
        self.assertEqual(user.hashed_password, 'password')

    def test_create_user(self):
        user = User.create_user('username', 'password')
        self.assertIsInstance(user, User)
        created_user = User.query.filter_by(username='username').first()
        self.assertEqual(created_user.username, user.username)
        self.assertEqual(created_user.hashed_password, user.hashed_password)

    def test_register(self):
        pass

    def test_login(self):
        pass
