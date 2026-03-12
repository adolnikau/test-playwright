import { EmployeeRequest, EmployeeResponse, EmployeeSchema } from "../../src/api/models/employee";
import { APIResponse } from "@playwright/test";
import { test as base } from "../../src/api/fixtures";

type LocalFixtures = {
    createEmployee: (request: EmployeeRequest) => Promise<readonly [APIResponse, EmployeeResponse]>;
    newTestEmployee: [EmployeeRequest, EmployeeResponse];
};

export const test = base.extend<LocalFixtures>({
    createEmployee: async ({ employeesApi }, use) => {
        const employeeIds: string[] = [];

        const factory = async (request: EmployeeRequest) => {
            const response = await employeesApi.post(request);

            if (response.ok()) {
                const employee = EmployeeSchema.parse(await response.json());
                employeeIds.push(employee.id);
                return [response, employee] as const;
            }
            return [response, null] as const;
        };

        await use(factory);

        for (const id of employeeIds) {
            await employeesApi.delete(id).catch((err) =>
                console.warn(`Cleanup failed for employee ${id}:`, err)
            );
        }
    },

    newTestEmployee: async ({ createEmployee }, use) => {
        const request: EmployeeRequest = {
            username: "TestUsername",
            firstName: "Test First Name",
            lastName: "Test Last Name",
            dependants: 1,
        }
        const employee = await createEmployee(request);
        await use([request, employee[1]]);
    }
});

export { expect } from '@playwright/test';