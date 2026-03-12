import {type Locator, type Page} from "@playwright/test";

export class NewEmployeePage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly dependentsInput: Locator;
    readonly addBtn: Locator;
    readonly updateBtn: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.getByTestId("firstName");
        this.lastNameInput = page.getByTestId("lastName");
        this.dependentsInput = page.getByTestId("dependants");
        this.addBtn = page.getByTestId("addEmployee");
        this.updateBtn = page.getByTestId("updateEmployee");
        this.errorMessage = page.locator("//*[contains(@class, 'validation-summary-errors')]")
    }

    async addNewEmployee(firstName: string, lastName: string, dependents: number) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.dependentsInput.fill(dependents.toString())
        await this.addBtn.click();
    }

    async updateEmployee(firstName: string, lastName: string, dependents: number) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.dependentsInput.fill(dependents.toString())
        await this.updateBtn.click();
    }
}