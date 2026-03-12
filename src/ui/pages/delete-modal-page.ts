import { Locator, Page } from "@playwright/test";

export class DeleteModalPage {

    readonly page: Page
    readonly deleteBtn: Locator

    constructor(page: Page) {
        this.page = page
        this.deleteBtn = page.getByTestId("deleteEmployee")
    }

}