import unittest

import bcrypt

from whiskedinRESTAPI.app import db, app, User
from whiskedinRESTAPI.whiskedinRESTAPI.whisked_test import WhiskedTest


class UserTests(WhiskedTest):
    TEST_DB = 'test.db'

    ############################
    #### setup and teardown ####
    ############################

    # executed prior to each test


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
        response = self.app.post('/register', data={'username': 'username', 'password': 'password'})
        self.assertEqual(response.status, '201 CREATED')
        self.assertIn('access_token', response.json)

    def test_register_username_exists(self):
        self.create_test_user()
        response = self.app.post('/register', data={'username': 'username', 'password': 'password'})
        self.assertEqual(response.status, '400 BAD REQUEST')
        self.assertEqual(response.json['msg'], 'username already exists')

    def test_login_no_user(self):
        response = self.app.post('/login', data={'username': 'username', 'password': 'password'})
        self.assertEqual(response.status, '400 BAD REQUEST')
        self.assertIn('msg', response.json)

    def test_login_user_exists(self):
        self.create_test_user()
        response = self.app.post('/login', data={'username': 'username', 'password': 'password'})
        self.assertEqual(response.status, '200 OK')
        self.assertIn('access_token', response.json)

    def test_login_user_wrong_password(self):
        self.create_test_user()
        response = self.app.post('/login', data={'username': 'username', 'password': 'pass'})
        self.assertEqual(response.status, '400 BAD REQUEST')
        self.assertEqual(response.json['msg'], 'Invalid username or password')

    def create_test_user(self):
        password = 'password'
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        user = User(username='username', hashed_password=hashed_password)
        db.session.add(user)
        db.session.commit()
