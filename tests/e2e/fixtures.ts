import { test as baseTest, } from '../../src/ui/fixtures'
import { EmployeeRequest, EmployeeSchema } from "../../src/api/models/employee";
import { EmployeesApi } from "../../src/api/clients/employees-api";

type FixtureTypes = {
    newEmployeeId: string
}

export const test = baseTest.extend<FixtureTypes>({
    newEmployeeId: async ({ request }, use) => {
        const employeeIds: string[] = [];
        const api = new EmployeesApi(request)
        const body: EmployeeRequest = {
            username: "TestUsrname",
            firstName: "Frontender",
            lastName: "Newman",
            dependants: 1
        }

        const response = await api.post(body);
        const employee = EmployeeSchema.parse(await response.json());
        employeeIds.push(employee.id);
        await use(employee.id);

        for (const id of employeeIds) {
            await api.delete(id).catch((_) => {});
        }
    },
});

export { expect } from '@playwright/test';