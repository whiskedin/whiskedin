import json


from whiskedinRESTAPI.whiskedinRESTAPI.app import User, db, Whisky
from whiskedinRESTAPI.whiskedinRESTAPI.whisked_test import WhiskedTest


class UserTests(WhiskedTest):

    def setUp(self):
        super(UserTests, self).setUp()

    def test_get_user_empty(self):
        username = 'username2'
        user = User.get_user(username)
        self.assertEqual(None, user)

    def test_get_user_exists(self):
        user = User.get_user('username')
        self.assertIsNotNone(user)
        self.assertEqual(user.username, 'username')
        self.assertIsNotNone(user.hashed_password)

    def test_create_user(self):
        user = User.create_user('username2', 'password')
        self.assertIsInstance(user, User)
        created_user = User.query.filter_by(username='username2').first()
        self.assertEqual(created_user.username, user.username)
        self.assertEqual(created_user.hashed_password, user.hashed_password)

    def test_build_dict_user(self):
        username = 'username2'
        password = 'password'
        user = User(username=username, hashed_password=password)
        db.session.add(user)
        db.session.commit()
        user_dict = user.build_dict()
        self.assertEqual(user_dict['uid'], 2)
        self.assertEqual(user_dict['username'], username)
        self.assertEqual(len(user_dict), 2)

    def test_register(self):
        response = self.app.post('/register',  data={'username': 'username2', 'password': 'password'})
        self.assertEqual(response.status, '201 CREATED')
        self.assertIn('access_token', response.json)

    def test_register_username_exists(self):
        response = self.app.post('/register',  data={'username': 'username', 'password': 'password'})
        self.assertEqual(response.status, '400 BAD REQUEST')
        self.assertEqual(response.json['msg'], 'username already exists')

    def test_login_no_user(self):
        response = self.app.post('/login', data={'username': 'username2', 'password': 'password'})
        self.assertEqual(response.status, '400 BAD REQUEST')
        self.assertIn('msg', response.json)

    def test_login_user_exists(self):
        response = self.app.post('/login',  data={'username': 'username', 'password': 'password'})
        self.assertEqual(response.status, '200 OK')
        self.assertIn('access_token', response.json)

    def test_login_user_wrong_password(self):
        response = self.app.post('/login',  data={'username': 'username', 'password': 'pass'})
        self.assertEqual(response.status, '400 BAD REQUEST')
        self.assertEqual(response.json['msg'], 'Invalid username or password')


class WhiskyTests(WhiskedTest):

    def test_create_whisky(self):
        whisky = Whisky.create_whisky('name', 'company', 'type', 12, 'origin', 'flavor', 'description', 5,
                                      self.user.uid)
        whisky_added = Whisky.query.filter_by(wid=whisky.wid).first()
        for key in self.whisky_dict:
            self.assertEqual(whisky.__getattribute__(key), whisky_added.__getattribute__(key))

    def test_create_whisky_empty_field(self):
        whisky_fields = self.whisky_dict.keys()
        for field in whisky_fields:
            copy_dict = self.whisky_dict.copy()
            copy_dict.pop(field)
            try:
                Whisky.create_whisky(**copy_dict)
                self.fail()
            except:
                pass

    def test_get_whisky(self):
        added_whisky = self.create_test_whisky()
        searched_whisky = Whisky.get_wisky(added_whisky.wid)
        for key in self.whisky_dict:
            self.assertEqual(added_whisky.__getattribute__(key), searched_whisky.__getattribute__(key))

    def test_get_whisky_not_existing(self):
        searched_whisky = Whisky.get_wisky(0)
        self.assertIsNone(searched_whisky)
        whisky = self.create_test_whisky()
        searched_whisky = Whisky.get_wisky(whisky.wid + 1)
        self.assertIsNone(searched_whisky)

    def test_update_whisky(self):
        whisky = self.create_test_whisky()
        self.whisky_dict['wid'] = whisky.wid
        self.whisky_dict['name'] = 'updated'
        updated_whisk = Whisky.update_whisky(self.whisky_dict, self.user.uid)
        self.assertEqual(whisky.wid, updated_whisk.wid)
        self.assertEqual(whisky.name, updated_whisk.name)
        for key in self.whisky_dict:
            self.assertEqual(whisky.__getattribute__(key), updated_whisk.__getattribute__(key))

    def test_update_whisky_only_owner(self):
        whisky = self.create_test_whisky()
        self.whisky_dict['wid'] = 1
        failed_whisk = Whisky.update_whisky(self.whisky_dict, 2)
        self.assertIsNone(failed_whisk)

    def test_get_whiskies_search(self):
        self.create_test_whisky()
        for key, value in self.whisky_dict.items():
            if key != 'age' and key != 'rating' and key != 'created_by':
                searched_whisky = Whisky.get_whiskies(value, self.user.uid)
                whiskies = [whisky for whisky in searched_whisky]
                self.assertEqual(1, len(whiskies), msg=key)
        self.create_test_whisky()
        for key, value in self.whisky_dict.items():
            if key != 'age' and key != 'rating' and key != 'created_by':
                searched_whisky = Whisky.get_whiskies(value, self.user.uid)
                whiskies = [whisky for whisky in searched_whisky]
                self.assertEqual(2, len(whiskies))
        self.whisky_dict['name'] = 'bork'
        self.create_test_whisky()
        self.create_test_user('username2')
        self.create_test_whisky(uid=2)
        searched_whisky = Whisky.get_whiskies('bork', self.user.uid)
        whiskies = [whisky for whisky in searched_whisky]
        self.assertEqual(1, len(whiskies))

    def test_get_whiskies_endpoint_no_token(self):
        response = self.app.get('/whiskies')
        self.assertEqual(response.status_code, 401)

    def test_get_whiskies_endpoint_success(self):
        token = self.app.post('/login',  data={'username': self.user.username,
                                              'password': 'password'}).json['access_token']
        response = self.app.get('/whiskies', headers={'Authorization': 'Bearer %s' % token})
        whiskies = response.json
        self.assertEqual([], whiskies['whiskies'])
        self.create_test_whisky()
        response = self.app.get('/whiskies', headers={'Authorization': 'Bearer %s' % token})
        whiskies = response.json
        self.assertEqual(1, len(whiskies['whiskies']))

    def test_get_whiskies_only_user_whisky(self):
        '''
        Tests that a user only sees their whiskies
        '''
        self.test_create_whisky()
        self.create_test_user('username2')
        token = self.app.post('/login',  data={'username': self.user.username,
                                                         'password': 'password'}).json['access_token']

        self.create_test_whisky(uid=2)
        response = self.app.get('/whiskies', headers={'Authorization': 'Bearer %s' % token})
        whiskies = response.json
        self.assertEqual(1, len(whiskies['whiskies']))
        self.assertEqual(1, whiskies['whiskies'][0]['wid'])

        token_2 = self.app.post('/login',  data={'username': 'username2',
                                                           'password': 'password'}).json['access_token']
        response = self.app.get('/whiskies', headers={'Authorization': 'Bearer %s' % token_2})
        whiskies = response.json
        self.assertEqual(1, len(whiskies['whiskies']))
        self.assertEqual(2, whiskies['whiskies'][0]['wid'])

    def test_post_whisky_endpoint(self):
        '''
        Tests that user can add whiskies, that the posted data is correct and that other users can't see that whisky
        '''
        token = self.app.post('/login',   data={'username': self.user.username,
                                                         'password': 'password'}).json['access_token']
        whiskies = self.app.get('/whiskies', headers={'Authorization': 'Bearer %s' % token}).json['whiskies']
        self.assertEqual(0, len(whiskies))

        added_whisky_response = self.app.post('/whiskies', data=json.dumps(self.whisky_dict), headers={'Authorization': 'Bearer %s' % token, 'Content-Type': 'application/json'})
        added_whisky = added_whisky_response.json['whisky']
        self.assertEqual(201, added_whisky_response.status_code)
        for key, value in added_whisky.items():
            if key != 'created_by' and key != 'created_at' and key != 'image' and key != 'wid':
                self.assertEqual(self.whisky_dict[key], value)
            elif key == 'created_by':
                self.assertEqual(value, 'username')
            elif key == 'wid':
                self.assertEqual(1, value)

        new_whiskies = self.app.get('/whiskies', headers={'Authorization': 'Bearer %s' % token}).json['whiskies']
        self.assertEqual(1, len(new_whiskies))

        self.create_test_user('username2')
        token_2 = self.app.post('/login',  data={'username': 'username2', 'password': 'password'}).json['access_token']
        other_user_whiskies = self.app.get('/whiskies', headers={'Authorization':
                                                                 'Bearer %s' % token_2}).json['whiskies']
        self.assertEqual(0, len(other_user_whiskies))

    def test_sending_str_age_rating(self):
        token = self.app.post('/login',  data={'username': self.user.username,
                                                                               'password': 'password'}).json['access_token']
        self.whisky_dict['age'] = 'sagsd'
        keys = ['age', 'origin']
        for key in keys:
            whisky_copy = self.whisky_dict.copy()
            whisky_copy[key] = 'asdkb'
            added_whisky_response = self.app.post('/whiskies', data=json.dumps(whisky_copy), headers={'Authorization': 'Bearer %s' % token, 'Content-Type': 'application/json'})
            self.assertEqual(added_whisky_response.status, '400 BAD REQUEST')
            self.assertEqual(added_whisky_response.json['msg'], 'age and rating must be integers')

    def test_put_whisky_endpoint(self):
        self.create_test_user('username2')
        token = self.app.post('/login',  data={'username': self.user.username,
                                                         'password': 'password'}).json['access_token']
        token_2 = self.app.post('/login',  data={'username': 'username2',
                                                         'password': 'password'}).json['access_token']
        self.create_test_whisky(self.user.uid)
        updated_whisky_dict = self.whisky_dict.copy()
        updated_whisky_dict['name'] = 'bork'
        updated_whisky_dict['wid'] = 1

        updated_whisky = self.app.put('/whiskies', data=json.dumps(updated_whisky_dict),
                                      headers={'Authorization': 'Bearer %s'
                                                                % token,
                                               'Content-Type': 'application/json'}).json['whisky']

        self.assertEqual(updated_whisky['name'], 'bork')
        whiskies = self.app.get('/whiskies', headers={'Authorization': 'Bearer %s' % token}).json['whiskies']
        self.assertEqual(whiskies[0]['name'], 'bork')

        failed_update = self.app.put('/whiskies', data=json.dumps(updated_whisky_dict),
                                      headers={'Authorization': 'Bearer %s'
                                                                % token_2,
                                               'Content-Type': 'application/json'})
        self.assertEqual(failed_update.status_code, 403)

    def test_search_endpoint(self):
        self.create_test_user('username2')
        for i in range(3):
            self.create_test_whisky(self.user.uid)
            self.create_test_whisky(uid=2)

        token = self.app.post('/login',  data={'username': self.user.username,
                                                         'password': 'password'}).json['access_token']

        for key, value in self.whisky_dict.items():
            if key != 'age' and key != 'rating' and key != 'created_by':
                whiskies = self.app.get('/whiskies?',
                                        headers={'Authorization': 'Bearer %s' % token}).json['whiskies']
                self.assertEqual(3, len(whiskies), key)

        self.whisky_dict['name'] = 'bork'
        for i in range(1, 3):
            self.create_test_whisky(uid=i)
        whiskies = self.app.get('/whiskies?s=%s' % 'bork',
                                headers={'Authorization': 'Bearer %s' % token}).json['whiskies']
        self.assertEqual(1, len(whiskies))
        self.assertEqual('bork', whiskies[0]['name'])
