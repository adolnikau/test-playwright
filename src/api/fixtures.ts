import {test as base} from '@playwright/test';
import {EmployeesApi} from "./clients/employees-api";

type ApiFixtures = {
    employeesApi: EmployeesApi;
};

export const test = base.extend<ApiFixtures>({
    employeesApi: async ({ request }, use) => {
        const api = new EmployeesApi(request);
        await use(api);
    },
});

export { expect } from '@playwright/test';