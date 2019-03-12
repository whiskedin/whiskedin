require('chromedriver');
const {By} = require('selenium-webdriver');


class Element {
    constructor(By, driver){
        this.By = By;
        this.driver = driver;
    }


    find(){
        return this.driver.findElement(this.By);
    }

    click() {
        this.find().click();
    }

    getText(){
        return this.find().getText();
    }
}


class POM {
    constructor(driver){
        this.driver = driver;
        this.username_login = new Element(By.id('UserAuth-username_login'), driver);
        this.password_login = new Element(By.id('UserAuth-password_login'), driver);
        this.sign_in_button = new Element(By.id('id_signin_button'), driver);
        this.sign_up_tab = new Element(By.id('id_sign_up'), driver);
        this.username_signup = new Element(By.id('UserAuth-username_sign_up'), driver);
        this.password_signup = new Element(By.id('UserAuth-password_sign_up'), driver);
        this.sign_up_button  = new Element(By.id('id_sign_up_button'), driver);
        this.next_button = new Element(By.id('id_next_button'), driver);
        this.back_button = new Element(By.id('id_back_button'), driver);
        this.share_button = new Element(By.id('id_share_button'), driver);
        this.logout_button = new Element(By.id('id_logout_button'), driver);
        this.whisk_name = new Element(By.id('id_name'), driver);
        this.brand = new Element(By.id('id_brand'), driver);
        this.img = new Element(By.id('id_image'), driver);
        this.whisk_card = new Element(By.id('id_whisk_card'), driver);
    }

}

module.exports = POM;
