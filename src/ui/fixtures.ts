import { test as base } from '@playwright/test'
import { LoginPage } from "./pages/login-page";
import {HeaderPage} from "./pages/header-page";
import {BenefitsPage} from "./pages/benefits-page";
import { NewEmployeePage } from "./pages/new-employee-page";
import { DeleteModalPage } from "./pages/delete-modal-page";

type Fixtures = {
    loginPage: LoginPage;
    headerPage: HeaderPage;
    newEmployeePage: NewEmployeePage;
    deleteModalPage: DeleteModalPage;
    benefitsPage: BenefitsPage;
};

export const test = base.extend<Fixtures>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    headerPage: async ({ page }, use) => {
        const headerPage = new HeaderPage(page);
        await use(headerPage);
    },
    newEmployeePage: async ({ page }, use) => {
        const newEmployeePage = new NewEmployeePage(page);
        await use(newEmployeePage);
    },
    deleteModalPage: async ({ page }, use) => {
        const deleteModalPage = new DeleteModalPage(page);
        await use(deleteModalPage);
    },
    benefitsPage: async ({ page, headerPage, newEmployeePage, deleteModalPage }, use) => {
        const benefitsPage = new BenefitsPage(page, headerPage, newEmployeePage, deleteModalPage);
        await use(benefitsPage);
    }
});

export { expect } from '@playwright/test';
