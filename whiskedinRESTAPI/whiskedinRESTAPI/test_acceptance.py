import os

from selenium import webdriver
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from whiskedinRESTAPI.whiskedinRESTAPI.app import db
from whiskedinRESTAPI.whiskedinRESTAPI.whisked_test import WhiskedTest


class Sprint1AcceptanceTests(WhiskedTest):
    '''
    Acceptance tests

    Test out deployment
    '''
    def setUp(self):
        self.driver = webdriver.Chrome(os.getcwd() + '/whiskedinRESTAPI/whiskedinRESTAPI/Drivers/chromedriver')
        self.wait = WebDriverWait(self.driver, 10)
        db.drop_all()
        db.create_all()
        self.driver.get('http://whiskeding.herokuapp.com')

    def tearDown(self):
        db.drop_all()
        self.driver.quit()

    def test_register_login(self):
        self.assertFalse(self.driver.find_element_by_id('id_invalid_user').is_displayed())
        self.assertFalse(self.driver.find_element_by_id('id_existing_user').is_displayed())
        self.register_user('username', 'password')
        self.wait.until(EC.url_changes('http://whiskeding.herokuapp.com/'))
        self.assertEqual(self.driver.current_url, 'http://whiskeding.herokuapp.com/homepage')
        self.driver.get('http://whiskeding.herokuapp.com')
        self.register_user('username', 'password')
        self.wait.until(EC.visibility_of(self.driver.find_element_by_id('id_existing_user')))
        self.assertTrue(self.driver.find_element_by_id('id_existing_user').is_displayed())
        self.driver.find_element_by_id('id_sign_in').click()
        self.login_user('username', 'password')
        self.wait.until(EC.url_changes('http://whiskeding.herokuapp.com/'))
        self.assertEqual(self.driver.current_url, 'http://whiskeding.herokuapp.com/homepage')
        self.driver.get('http://whiskeding.herokuapp.com/')
        self.wait.until(EC.url_matches('http://whiskeding.herokuapp.com/'))
        self.login_user('username', 'pass')
        self.wait.until(EC.visibility_of(self.driver.find_element_by_id('id_invalid_user')))
        self.assertTrue(self.driver.find_element_by_id('id_invalid_user').is_displayed())

    def test_whisk_list(self):
        self.register_user('username', 'password')
        self.wait.until(EC.url_changes('http://whiskeding.herokuapp.com/'))
        next = self.driver.find_element_by_id('id_next_button')
        back = self.driver.find_element_by_id('id_back_button')
        self.click_whisk(next)
        self.click_whisk(back)

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

    def click_whisk(self, button):
        for index in range(3):
            name = self.driver.find_element_by_id('id_name').text
            brand = self.driver.find_element_by_id('id_brand').text
            button.click()
            if index != 2:
                self.assertNotEqual(name, self.driver.find_element_by_id('id_name').text)
                self.assertNotEqual(brand, self.driver.find_element_by_id('id_brand').text)
            else:
                self.assertEqual(name, self.driver.find_element_by_id('id_name').text)
                self.assertEqual(brand, self.driver.find_element_by_id('id_brand').text)