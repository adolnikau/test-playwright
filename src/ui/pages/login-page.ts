import {type Locator, type Page} from "@playwright/test";

export class LoginPage {
    readonly url = "Account/Login"

    readonly page: Page;
    readonly usernameField: Locator;
    readonly passwordField: Locator;
    readonly logInButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameField = page.getByTestId("Username")
        this.passwordField = page.getByTestId("Password")
        this.logInButton = page.locator("//*[@type='submit']")
        this.errorMessage = page.locator("//*[contains(@class, 'validation-summary-errors')]")
    }

    async goto() {
        await this.page.goto(this.url)
    }

    async login(username: string = process.env.TEST_USERNAME, password: string = process.env.TEST_PASSWORD) {
        await this.usernameField.fill(username)
        await this.passwordField.fill(password)
        await this.logInButton.click()
    }

}
