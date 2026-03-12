import { test, expect } from "./fixtures";
import { EmployeeRequest, EmployeeSchema } from "../../src/api/models/employee";
import { Benefits } from "../../src/utils/benefits";



test.describe("Benefits Calculation", async () => {

    [
        {dependants: 0, paycheck: 2000},
        {dependants: 2, paycheck: 2000},
        {dependants: 18, paycheck: 2000},
        {dependants: 32, paycheck: 2000},
        {dependants: 0, paycheck: 3000},
        {dependants: 2, paycheck: 3000},
        {dependants: 18, paycheck: 3000},
        {dependants: 32, paycheck: 3000},
    ].forEach(({ dependants, paycheck }) => {
        test(`Should correctly calculate salary when creating a new employee when employee has ${dependants} dependants and ${paycheck} paycheck`, async ({ employeesApi }) => {
            // Given
            const request: EmployeeRequest = {
                username: "TestCreateUsername",
                firstName: "Create First Name",
                lastName: "Create Last Name",
                dependants: dependants,
                salary: Benefits.salary(paycheck)
            }
            // When
            const response = await employeesApi.post(request)
            const employee = EmployeeSchema.parse(await response.json());
            // Then
            expect.soft(employee.salary).toBe(Benefits.salary(paycheck))
            expect.soft(employee.gross).toBe(paycheck)
            expect.soft(employee.benefitsCost).toBeCloseTo(Benefits.benefitsCostsPerPaycheck(dependants))
            expect.soft(employee.net).toBeCloseTo(Benefits.net_paycheck(dependants, paycheck))
            // Cleanup
            await employeesApi.delete(employee.id)

        });
    });

    [
        {dependants: 0, paycheck: 2000},
        {dependants: 2, paycheck: 2000},
        {dependants: 18, paycheck: 2000},
        {dependants: 32, paycheck: 2000},
        {dependants: 0, paycheck: 3000},
        {dependants: 2, paycheck: 3000},
        {dependants: 18, paycheck: 3000},
        {dependants: 32, paycheck: 3000},
    ].forEach(({ dependants, paycheck }) => {
        test(`Should correctly calculate salary when updating employee to have ${dependants} dependants and ${paycheck} paycheck`, async ({ employeesApi, newTestEmployee }) => {
            // Given
            const id = newTestEmployee[1].id
            const request: EmployeeRequest = {
                id: id,
                username: "TestUpdateUsername",
                firstName: "Update First Name",
                lastName: "Update Last Name",
                dependants: dependants,
                salary: Benefits.salary(paycheck)
            }
            // When
            const response = await employeesApi.put(request)
            const employee = EmployeeSchema.parse(await response.json());
            // Then
            expect.soft(employee.salary).toBe(Benefits.salary(paycheck))
            expect.soft(employee.gross).toBe(paycheck)
            expect.soft(employee.benefitsCost).toBeCloseTo(Benefits.benefitsCostsPerPaycheck(dependants))
            expect.soft(employee.net).toBeCloseTo(Benefits.net_paycheck(dependants, paycheck))
        });
    });
});