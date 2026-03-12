import { test, expect } from "../../src/ui/fixtures";

test.describe("Login page tests", () => {

    test.beforeEach(async ({loginPage}) => {
        await loginPage.goto()
    });

    test('should login with correct credentials', async ({loginPage, headerPage}) => {
        // When
        await loginPage.login()
        // Then
        await expect(headerPage.logoutBtn).toBeVisible()
    });

    [
        {
            test_name: "Empty Password",
            username: "Test1",
            password: "",
            expected_error: "The Password field is required."
        },
        {
            test_name: "Empty Username",
            username: "",
            password: "Test2",
            expected_error: "The Username field is required."
        },
    ].forEach(({test_name, username, password, expected_error}) => {
        test(`should display error when credentials are empty (${test_name})`, async ({loginPage}) => {
            // When
            await loginPage.login(username, password)
            // Then
            await expect(loginPage.errorMessage).toContainText(expected_error)
        });
    });


    [
        {
            test_name: "Wrong Password",
            username: process.env.TEST_USERNAME,
            password: "wrong_password",
        },
        {
            test_name: "Wrong Username and Password",
            username: "wrong_username",
            password: "wrong_password",
        },
    ].forEach(({test_name, username, password}) => {
        test(`should display error when credentials are incorrect (${test_name})`, async ({loginPage}) => {
            // When
            await loginPage.login(username, password)
            // Then
            await expect(loginPage.errorMessage).toContainText("The specified username or password is incorrect.")
        });
    });
});