import {type Locator, type Page} from "@playwright/test";

export class HeaderPage {
    readonly page: Page;
    readonly benefitsLogo: Locator;
    readonly logoutBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.benefitsLogo = page.locator("//*[@class='navbar-brand']")
        this.logoutBtn = page.getByRole("link", { name: "Log Out" })
    }

}