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
    }, 35000);

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
        await sleep(2000);
        assert(await driver.findElement(By.id('id_next_button')).isDisplayed());
        assert(await driver.findElement(By.id('id_back_button')).isDisplayed());
        assert(await driver.findElement(By.id('id_share_button')).isDisplayed());
        assert(await driver.findElement(By.id('id_logout_button')).isDisplayed());
        assert(await driver.findElement(By.id('id_whisk_card')).isDisplayed());
        assert(await driver.findElement(By.id('id_appbar')).isDisplayed());
        assert(await driver.findElement(By.id('id_appbar_title')).isDisplayed());
        assert(await driver.findElement(By.id('id_whisk_list')).isDisplayed());
        assert(await driver.findElement(By.id('id_add_button')).isDisplayed());
        assert(await driver.findElement(By.id('id_search_input')).isDisplayed());
        assert(await driver.findElement(By.id('id_name')).isDisplayed());
        assert(await driver.findElement(By.id('id_brand')).isDisplayed());
        assert(await driver.findElement(By.id('id_img')).isDisplayed());
        assert(await driver.findElement(By.id('id_type')).isDisplayed());
        assert(await driver.findElement(By.id('id_age')).isDisplayed());
        assert(await driver.findElement(By.id('id_origin')).isDisplayed());
        assert(await driver.findElement(By.id('id_flavor')).isDisplayed());
        assert(await driver.findElement(By.id('id_description')).isDisplayed());
        assert(await driver.findElement(By.id('id_rating')).isDisplayed()); 
        assert(await driver.findElement(By.id('id_edit_button0')).isDisplayed());
        await sleep(2000);
    }, 40000);

    test('Add button clicked, check create form elements', async function() {
        await driver.get('http://localhost:3000/homepage');
        await sleep(5000);
        
        let add_button = await driver.findElement(By.id('id_add_button'));
        add_button.click();

        await sleep(1000)
        assert(await driver.findElement(By.id('id_form_title')).isDisplayed());
        assert(await driver.findElement(By.id('id_name_create')).isDisplayed());
        assert(await driver.findElement(By.id('id_company_create')).isDisplayed());
        assert(await driver.findElement(By.id('id_type_create')).isDisplayed());
        assert(await driver.findElement(By.id('id_age_create')).isDisplayed());
        assert(await driver.findElement(By.id('id_origin_create')).isDisplayed());
        assert(await driver.findElement(By.id('id_flavor_create')).isDisplayed());
        assert(await driver.findElement(By.id('id_description_create')).isDisplayed());
        assert(await driver.findElement(By.id('id_rating_create')).isDisplayed());
    }, 20000);

    test('List item clicked and card is changed', async function() {
        await driver.get('http://localhost:3000/homepage');
        await sleep(2000);
        
        //assert(await driver.findElement(By.id('id_edit_button0')).isDisplayed());
        for(let i = 0; i < 10; i++){
            let listItemId = 'id_item_' + i
            let listItemTextId = 'id_list_item_text' + i

            let list_item = await driver.findElement(By.id(listItemId));
            let name = await driver.findElement(By.id(listItemTextId)).getText();
            list_item.click()
            await sleep(1000);
            
            assert(name, await driver.findElement(By.id('id_name')).getText());
            await sleep(1000);
        }
    }, 30000);

    // AQUIIIII ---------------
    test('Edit button clicked, cheks edit form appears, and clicks create button on form', async function() {
        await driver.get('http://localhost:3000/homepage');
        await sleep(2000);

        for(let i = 0; i < 10; i++){
            let editButtonId = 'id_edit_button' + i

            let editButton = await driver.findElement(By.id(editButtonId));
            editButton.click()
            await sleep(1000);
            
            assert(await driver.findElement(By.id('id_form_dialog_title')).isDisplayed());
            let submit_button = await driver.findElement(By.id('id_button_submit'));
            submit_button.click()
            await sleep(1000);
        }
    }, 30000);

    test('Can click next and previous', async function() {
        await driver.get('http://localhost:3000/homepage');
        await sleep(5000);
        let next_button = await driver.findElement(By.id('id_next_button'));
        let back_button = await driver.findElement(By.id('id_back_button'));
        for(var i=0;i<10;i++){
            let name = await driver.findElement(By.id('id_name')).getText();
            let brand = await driver.findElement(By.id('id_brand')).getText();
            let type = await driver.findElement(By.id('id_type')).isDisplayed();
            let age = await driver.findElement(By.id('id_age')).isDisplayed();
            let origin = await driver.findElement(By.id('id_origin')).isDisplayed();
            let flavor = await driver.findElement(By.id('id_flavor')).isDisplayed();
            let description = await driver.findElement(By.id('id_description')).isDisplayed();
            let rating = await driver.findElement(By.id('id_rating')).isDisplayed();
            next_button.click();
            if (i !== 9) {
                assert.notEqual(name, await driver.findElement(By.id('id_name')).getText());
                assert.notEqual(brand, await driver.findElement(By.id('id_brand')).getText());
                assert.notEqual(type, await driver.findElement(By.id('id_type')).getText());
                assert.notEqual(age, await driver.findElement(By.id('id_age')).getText());
                assert.notEqual(origin, await driver.findElement(By.id('id_origin')).getText());
                assert.notEqual(flavor, await driver.findElement(By.id('id_flavor')).getText());
                assert.notEqual(description, await driver.findElement(By.id('id_description')).getText());
                assert.notEqual(rating, await driver.findElement(By.id('id_rating')).getText());
            }
            else{
                assert(name, await driver.findElement(By.id('id_name')).getText());
                assert(brand, await driver.findElement(By.id('id_brand')).getText());
                assert(type, await driver.findElement(By.id('id_type')).getText());
                assert(age, await driver.findElement(By.id('id_age')).getText());
                assert(origin, await driver.findElement(By.id('id_origin')).getText());
                assert(flavor, await driver.findElement(By.id('id_flavor')).getText());
                assert(description, await driver.findElement(By.id('id_description')).getText());
                assert(rating, await driver.findElement(By.id('id_rating')).getText());
            }
        }

        for(i=0;i<10;i++){
            let name = await driver.findElement(By.id('id_name')).getText();
            let brand = await driver.findElement(By.id('id_brand')).getText();
            let type = await driver.findElement(By.id('id_type')).isDisplayed();
            let age = await driver.findElement(By.id('id_age')).isDisplayed();
            let origin = await driver.findElement(By.id('id_origin')).isDisplayed();
            let flavor = await driver.findElement(By.id('id_flavor')).isDisplayed();
            let description = await driver.findElement(By.id('id_description')).isDisplayed();
            let rating = await driver.findElement(By.id('id_rating')).isDisplayed();
            back_button.click();
            if (i !== 9) {
                assert.notEqual(name, await driver.findElement(By.id('id_name')).getText());
                assert.notEqual(brand, await driver.findElement(By.id('id_brand')).getText());
                assert.notEqual(type, await driver.findElement(By.id('id_type')).getText());
                assert.notEqual(age, await driver.findElement(By.id('id_age')).getText());
                assert.notEqual(origin, await driver.findElement(By.id('id_origin')).getText());
                assert.notEqual(flavor, await driver.findElement(By.id('id_flavor')).getText());
                assert.notEqual(description, await driver.findElement(By.id('id_description')).getText());
                assert.notEqual(rating, await driver.findElement(By.id('id_rating')).getText());
            }
            else{
                assert(name, await driver.findElement(By.id('id_name')).getText());
                assert(brand, await driver.findElement(By.id('id_brand')).getText());
                assert(type, await driver.findElement(By.id('id_type')).getText());
                assert(age, await driver.findElement(By.id('id_age')).getText());
                assert(origin, await driver.findElement(By.id('id_origin')).getText());
                assert(flavor, await driver.findElement(By.id('id_flavor')).getText());
                assert(description, await driver.findElement(By.id('id_description')).getText());
                assert(rating, await driver.findElement(By.id('id_rating')).getText());
            }
        }
    }, 20000);
});


