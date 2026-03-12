import { test as setup, expect } from '../../src/ui/fixtures';
import * as path from 'path';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

setup('authenticate', async ({ page, loginPage, headerPage }) => {
    await loginPage.goto()
    await loginPage.login()
    await expect(headerPage.logoutBtn).toBeVisible()
    await page.context().storageState({ path: authFile });
});