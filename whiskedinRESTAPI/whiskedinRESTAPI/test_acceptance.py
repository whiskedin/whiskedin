import os
import time

from selenium import webdriver
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from whiskedinRESTAPI.whiskedinRESTAPI.app import db, User, Whisky
from whiskedinRESTAPI.whiskedinRESTAPI.whisked_test import WhiskedTest


class AcceptanceTests(WhiskedTest):
    def setUp(self):
        self.driver = webdriver.Chrome(os.getcwd() + '/whiskedinRESTAPI/whiskedinRESTAPI/Drivers/chromedriver')
        self.wait = WebDriverWait(self.driver, 10)
        db.drop_all()
        db.create_all()
        self.driver.get(self.deployment_url)

    def tearDown(self):
        super(AcceptanceTests, self).tearDown()
        self.driver.quit()

    def login_user(self, username, password):
        username_field = self.driver.find_element_by_id("UserAuth-username_login")
        password_field = self.driver.find_element_by_id("UserAuth-password_login")
        username_field.send_keys(username)
        password_field.send_keys(password)
        login_button = self.driver.find_element_by_id('id_signin_button')
        login_button.click()

    def register_user(self, username, password):
        sign_up_tab = self.driver.find_element_by_id('id_sign_up')
        sign_up_tab.click()
        sign_up_button = self.driver.find_element_by_id('id_sign_up_button')
        username_field = self.driver.find_element_by_id("UserAuth-username_sign_up")
        password_field = self.driver.find_element_by_id("UserAuth-password_sign_up")
        username_field.send_keys(username)
        password_field.send_keys(password)
        sign_up_button.click()

    def click_whisk(self, button, times_to_click):
        for index in range(times_to_click):
            name = self.driver.find_element_by_id('id_name').text
            brand = self.driver.find_element_by_id('id_brand').text
            button.click()
            if index != times_to_click - 1:
                self.assertNotEqual(name, self.driver.find_element_by_id('id_name').text)
                self.assertNotEqual(brand, self.driver.find_element_by_id('id_brand').text)
            else:
                self.assertEqual(name, self.driver.find_element_by_id('id_name').text)
                self.assertEqual(brand, self.driver.find_element_by_id('id_brand').text)

    def wait_until(self, reason, condition):
        self.wait.until(reason(condition))


class Sprint1AcceptanceTests(AcceptanceTests):
    '''
    Acceptance tests

    Test out deployment
    '''
    deployment_url = "http://whiskeding.herokuapp.com/"

    def test_register_login(self):
        print("Testing register login")
        self.assertFalse(self.driver.find_element_by_id('id_invalid_user').is_displayed())
        self.assertFalse(self.driver.find_element_by_id('id_existing_user').is_displayed())
        self.register_user('username', 'password')
        self.wait.until(EC.url_changes(self.deployment_url))
        self.assertEqual(self.driver.current_url, self.deployment_url + "homepage")
        self.driver.get(self.deployment_url)
        self.register_user('username', 'password')
        self.wait.until(EC.visibility_of(self.driver.find_element_by_id('id_existing_user')))
        self.assertTrue(self.driver.find_element_by_id('id_existing_user').is_displayed())
        self.driver.find_element_by_id('id_sign_in').click()
        self.login_user('username', 'password')
        self.wait.until(EC.url_changes(self.deployment_url))
        self.assertEqual(self.driver.current_url, self.deployment_url + 'homepage')
        self.driver.get(self.deployment_url)
        self.wait.until(EC.url_matches(self.deployment_url))
        self.login_user('username', 'pass')
        self.wait.until(EC.visibility_of(self.driver.find_element_by_id('id_invalid_user')))
        self.assertTrue(self.driver.find_element_by_id('id_invalid_user').is_displayed())

    def test_whisk_list(self):
        print("Testing whisk list")
        self.register_user('username', 'password')
        self.wait.until(EC.url_changes(self.deployment_url))
        next = self.driver.find_element_by_id('id_next_button')
        back = self.driver.find_element_by_id('id_back_button')
        self.click_whisk(next, 3)
        self.click_whisk(back, 3)


class Sprint2AcceptanceTests(AcceptanceTests):
    deployment_url = "http://whiskeding2.herokuapp.com"

    def setUp(self):
        super(Sprint2AcceptanceTests, self).setUp()
        self.whisky_dict = {
            'name': 'name',
            'company': 'company',
            'type': 'type',
            'age': 12,
            'origin': 'origin',
            'flavor': 'flavor',
            'description': 'description',
            'rating': 5,
        }

    def test_empty_whisk_list(self):
        self.register_user('username', 'password')
        self.wait_until(EC.url_changes, self.deployment_url + "homepage")
        time.sleep(2)
        self.assertTrue(self.driver.find_element_by_id("id_empty_list").is_displayed())
        self.driver.get(self.deployment_url)
        self.login_user('username', 'password')
        self.wait_until(EC.url_changes, self.deployment_url + "homepage")
        time.sleep(2)
        self.assertTrue(self.driver.find_element_by_id("id_empty_list").is_displayed())

    def test_visible_whiskies(self):
        print("Testing visible whiskies")
        user = User.create_user('username', 'password')
        self.load_whiskies(user)
        self.login_user('username', 'password')
        self.wait_until(EC.url_changes, self.deployment_url + "homepage")
        time.sleep(2)
        try:
            self.driver.find_element_by_id("id_empty_list")
            self.fail("List shouldn't be empty")
        except:
            pass
        time.sleep(1)
        next = self.driver.find_element_by_id("id_next_button")
        back = self.driver.find_element_by_id("id_back_button")
        self.click_whisk(next, 5)
        self.click_whisk(back, 5)

    def test_creating_whisky(self):
        User.create_user('username', 'password')
        self.login_user('username', 'password')
        self.wait_until(EC.url_changes, self.deployment_url + "homepage")
        time.sleep(2)
        add = self.driver.find_element_by_id("id_add_button")
        add.click()
        self.fill_whisky_form('create')
        create = self.driver.find_element_by_id("id_button_create")
        create.click()
        time.sleep(3)
        whisk = self.get_whisky_card_attr()
        self.compare_whisk(whisk)
        self.driver.get(self.deployment_url)
        self.login_user('username', 'password')
        self.wait_until(EC.url_changes, self.deployment_url + "homepage")
        time.sleep(3)
        try:
            list_item = self.driver.find_element_by_id("id_item_0")
            self.assertIsNotNone(list_item)
            self.assertEqual(list_item.text, 'name')
        except:
            self.fail('Whisky not in list')
        try:
            whis = self.get_whisky_card_attr()
            self.assertIsNotNone(whis)
        except:
            self.fail("Card not showing")
        self.compare_whisk(whis)

    def test_editing_whisky(self):
        user = User.create_user('username', 'password')
        self.load_whiskies(user)
        self.login_user('username', 'password')
        time.sleep(2)
        whis = self.get_whisky_card_attr()
        edit = self.driver.find_element_by_name('edit')
        edit.click()
        self.fill_whisky_form('edit')
        self.driver.find_element_by_id('id_button_submit').click()
        time.sleep(5)
        list_item = self.driver.find_element_by_id("id_item_4")
        list_item.click()
        time.sleep(5)
        new_whis = self.get_whisky_card_attr()
        for key, value in whis.items():
            self.assertNotEqual(whis[key], new_whis[key])
        self.driver.get(self.deployment_url)
        self.login_user('username', 'password')
        time.sleep(5)
        next_button = self.driver.find_element_by_id("id_next_button")
        found_updated = False
        for i in range(5):
            time.sleep(1)
            whisk = self.get_whisky_card_attr()
            if whisk['name'] == "name0name":
                found_updated = True
                break
            next_button.click()
        self.assertTrue(found_updated)

    def test_search_whisky(self):
        user = User.create_user('username', 'password')
        Whisky.create_whisky('unique', 'unique', 'unique', 12, 'unique', 'unique', 'unique', 5, user.uid)
        self.load_whiskies(user)
        self.login_user('username', 'password')
        time.sleep(5)
        items = []
        for i in range(5):
            items.append(self.driver.find_element_by_id("id_item_%s" % i))
        search_field = self.driver.find_element_by_id("id_search_input")
        search_field.send_keys("unique")
        time.sleep(5)
        new_items = []
        for i in range(5):
            if i == 0:
                new_items.append(self.driver.find_element_by_id("id_item_%s" % i))
            else:
                try:
                    self.driver.find_element_by_id("id_item_%s" % i)
                    self.fail()
                except:
                    pass
        self.assertEqual(len(new_items), 1)
        self.assertNotEqual(len(new_items), len(items))
        whisk = self.get_whisky_card_attr()
        self.assertEqual(whisk['name'], 'unique')
        search_field.clear()
        search_field.send_keys('545')
        time.sleep(5)
        try:
            self.driver.find_element_by_id("id_name_0")
            self.fail()
        except:
            pass

    def fill_whisky_form(self, type_form):
        name = self.driver.find_element_by_id("id_name_%s" % type_form)
        name.clear()
        name.send_keys('name')

        company = self.driver.find_element_by_id("id_company_%s" % type_form)
        company.clear()
        company.send_keys('company')

        type = self.driver.find_element_by_id("id_type_%s" % type_form)
        type.clear()
        type.send_keys('type')

        age = self.driver.find_element_by_id("id_age_%s" % type_form)
        age.clear()
        age.send_keys(12)

        origin = self.driver.find_element_by_id("id_origin_%s" % type_form)
        origin.clear()
        origin.send_keys('origin')

        flavor = self.driver.find_element_by_id("id_flavor_%s" % type_form)
        flavor.clear()
        flavor.send_keys('flavor')

        description = self.driver.find_element_by_id("id_description_%s" % type_form)
        description.clear()
        description.send_keys('description')

        rating = self.driver.find_element_by_id("id_rating_%s" % type_form)
        rating.clear()
        rating.send_keys(5)

    def get_whisky_card_attr(self):
        name = self.driver.find_element_by_id("id_name").text
        company = self.driver.find_element_by_id("id_brand").text
        type = self.driver.find_element_by_id("id_type").text
        age = self.driver.find_element_by_id("id_age").text
        origin = self.driver.find_element_by_id("id_origin").text
        flavor = self.driver.find_element_by_id("id_flavor").text
        description = self.driver.find_element_by_id("id_description").text
        rating = self.driver.find_element_by_id("id_rating").text
        whisk = {
            'name': name,
            'company': company,
            'type': type,
            'age': age,
            'origin': origin,
            'flavor': flavor,
            'description': description,
            'rating': rating
        }
        return whisk

    def load_whiskies(self, user):
        for i in range(5):
            whisky = self.whisky_dict.copy()
            for key, value in whisky.items():
                if key != 'created_by':
                    if type(value) != str:
                        whisky[key] = value + i
                    else:
                        whisky[key] = value + str(i)

            Whisky.create_whisky(whisky['name'], whisky['company'], whisky['type'], whisky['age'], whisky['origin'],
                                 whisky['flavor'], whisky['description'], whisky['rating'], user.uid)

    def compare_whisk(self, whis):
        for key, value in whis.items():
            if key == 'age':
                self.assertEqual('12', value)
            elif key == 'rating':
                self.assertEqual('5', value)
            else:
                self.assertEqual(key, value)