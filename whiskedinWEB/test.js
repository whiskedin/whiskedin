require('chromedriver');
const assert = require('assert');
const {Builder, Key, By, until} = require('selenium-webdriver');
const POM = require('./POM.js');


describe('Tests', function() {
    let driver;
    beforeEach(async function() {
        // runs before all test in this block
        driver = await new Builder().forBrowser('chrome').build();
        driver.get('http://localhost:3000');
    });

    afterEach(async function() {
        await driver.quit();
    });

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    test('Check all elements are visible', async function() {
        // Load the page

        assert(await driver.findElement(By.id('UserAuth-username_login')).isDisplayed());
        assert(await driver.findElement(By.id('UserAuth-password_login')).isDisplayed());
        let sign_in = await driver.findElement(By.id('id_signin_button'));
        assert(await sign_in.getText(), "Login");

        await driver.findElement(By.id('id_sign_up')).click();
        assert(await driver.findElement(By.id('UserAuth-username_sign_up')).isDisplayed());
        assert(await driver.findElement(By.id('UserAuth-password_sign_up')).isDisplayed());
        let sign_up = await driver.findElement(By.id('id_sign_up_button'));
        assert(await sign_up.getText(), "Sign-Up");
    }, 20000);

    test('Login button and signup button redirect when success', async function() {
        let sign_in = await driver.findElement(By.id('id_signin_button'));
        await sign_in.click();

        assert(driver.getCurrentUrl(), 'http://localhost:3000/homepage');

        await driver.get('http://localhost:3000');
        let sign_up_tab = await driver.findElement(By.id('id_sign_up'));
        await sign_up_tab.click();
        let sign_up_button = await driver.findElement(By.id('id_sign_up_button'));
        await sign_up_button.click();
        assert(driver.getCurrentUrl(), 'http://localhost:3000/homepage');
    }, 20000);


    test('All homepage elements are visible', async function() {

        await driver.get('http://localhost:3000/homepage');
        await sleep(5000);
        assert(await driver.findElement(By.id('id_next_button')).isDisplayed());
        assert(await driver.findElement(By.id('id_back_button')).isDisplayed());
        assert(await driver.findElement(By.id('id_share_button')).isDisplayed());
        assert(await driver.findElement(By.id('id_logout_button')).isDisplayed());
        assert(await driver.findElement(By.id('id_whisk_card')).isDisplayed());
    }, 20000);

    test('Can click next and previous', async function() {
       await driver.get('http://localhost:3000/homepage');
       await sleep(5000);
       let next_button = await driver.findElement(By.id('id_next_button'));
       let back_button = await driver.findElement(By.id('id_back_button'));
       for(var i=0;i<10;i++){
           let name = await driver.findElement(By.id('id_name')).getText();
           let brand = await driver.findElement(By.id('id_brand')).getText();
           next_button.click();
           if (i !== 9) {
               assert.notEqual(name, await driver.findElement(By.id('id_name')).getText());
               assert.notEqual(brand, await driver.findElement(By.id('id_brand')).getText());
           }
           else{
               assert(name, await driver.findElement(By.id('id_name')).getText());
               assert(brand, await driver.findElement(By.id('id_brand')).getText());
           }
       }

       for(i=0;i<10;i++){
           let name = await driver.findElement(By.id('id_name')).getText();
           let brand = await driver.findElement(By.id('id_brand')).getText();
           back_button.click();
           if (i !== 9) {
               assert.notEqual(name, await driver.findElement(By.id('id_name')).getText());
               assert.notEqual(brand, await driver.findElement(By.id('id_brand')).getText());
           }
           else{
               assert(name, await driver.findElement(By.id('id_name')).getText());
               assert(brand, await driver.findElement(By.id('id_brand')).getText());
           }
       }
    }, 20000);
});


