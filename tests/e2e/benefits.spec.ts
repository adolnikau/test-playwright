import { test, expect } from "./fixtures";
import { Benefits } from "../../src/utils/benefits";

test.describe(`Benefits Dashboard tests - Add new employee`, () => {

    test.beforeEach(async ({benefitsPage}) => {
        await benefitsPage.goto();
        await expect(benefitsPage.employeesTableRows).not.toHaveCount(0)
    });

    test(`should add new employee`, async ({ benefitsPage }) => {
        // Given
        const firstName = "John";
        const lastName = "Doe";
        const dependents = 6;
        const salary = Benefits.salary().toFixed(2);
        const grossPay = Benefits.BASE_PAYCHECK.toFixed(2);
        const benefitsCost = Benefits.benefitsCostsPerPaycheck(dependents).toFixed(2);
        const netPay = Benefits.net_paycheck(dependents).toFixed(2);
        // When
        await benefitsPage.openAddEmployeeModal();
        await benefitsPage.newEmployeeModal.addNewEmployee(firstName, lastName, dependents);
        // Then
        const employee = await benefitsPage.get_employee_record_by_name("John");
        await expect.soft(employee.firstName).toHaveText(firstName);
        await expect.soft(employee.lastName).toHaveText(lastName);
        await expect.soft(employee.dependents).toHaveText(dependents.toString());
        await expect.soft(employee.salary).toHaveText(salary.toString());
        await expect.soft(employee.grossPay).toHaveText(grossPay.toString());
        await expect.soft(employee.benefitsCost).toHaveText(benefitsCost.toString());
        await expect.soft(employee.netPay).toHaveText(netPay.toString());
        // cleanup
        await benefitsPage.deleteEmployee(employee);
    });

    [
        {
            testName: "empty",
            firstName: "",
            errorMessage: "The firstName field is required.",
        },
        {
            testName: "longer than 50 symbols",
            firstName: "too_long_name_too_long_name_too_long_name_too_long1",
            errorMessage: "The field firstName must be a string with a maximum length of 50.",
        },
    ].forEach(({ testName, firstName, errorMessage }) => {
        test(`should not add new employee when First Name is incorrect (${testName})`, async ({ benefitsPage }) => {
            // Given
            const lastName = "Tester"
            const dependents = 1;
            // When
            await benefitsPage.openAddEmployeeModal();
            await benefitsPage.newEmployeeModal.addNewEmployee(firstName, lastName, dependents);
            // Then
            await expect(benefitsPage.newEmployeeModal.errorMessage).toHaveText(errorMessage);
        });
    });

    [
        {
            testName: "empty",
            lastName: "",
            errorMessage: "The lastName field is required.",
        },
        {
            testName: "longer than 50 symbols",
            lastName: "too_long_name_too_long_name_too_long_name_too_long1",
            errorMessage: "The field lastName must be a string with a maximum length of 50.",
        },
    ].forEach(({ testName, lastName, errorMessage }) => {
        test(`should not add new employee when Last Name is incorrect (${testName})`, async ({benefitsPage}) => {
            // Given
            const firstName = "Honza"
            const dependents = 1;
            // When
            await benefitsPage.openAddEmployeeModal();
            await benefitsPage.newEmployeeModal.addNewEmployee(firstName, lastName, dependents);
            // Then
            await expect(benefitsPage.newEmployeeModal.errorMessage).toHaveText(errorMessage);
        });
    });

    [
        {
            testName: "less than 0",
            dependents: -1,
            errorMessage: "The field dependants must be between 0 and 32.",
        },
        {
            testName: "more than 32",
            dependents: 33,
            errorMessage: "The field dependants must be between 0 and 32.",
        },
    ].forEach(({ testName, dependents, errorMessage }) => {
        test(`should not add new employee when dependents field is incorrect (${testName})`, async ({benefitsPage}) => {
            // Given
            const firstName = "Honza";
            const lastName = "Tester";
            // When
            await benefitsPage.openAddEmployeeModal();
            await benefitsPage.newEmployeeModal.addNewEmployee(firstName, lastName, dependents);
            // Then
            await expect(benefitsPage.newEmployeeModal.errorMessage).toHaveText(errorMessage);
        });
    });
});

test.describe(`Benefits Dashboard tests - update employee`, () => {

    test(`should update an employee`, async ({ newEmployeeId, benefitsPage }) => {
        // Given
        const firstName = "Honza";
        const lastName = "Tester";
        const dependents = 9;
        const salary = Benefits.salary().toFixed(2);
        const grossPay = Benefits.BASE_PAYCHECK.toFixed(2);
        const benefitsCost = Benefits.benefitsCostsPerPaycheck(dependents).toFixed(2);
        const netPay = Benefits.net_paycheck(dependents).toFixed(2);

        const employee = await benefitsPage.get_employee_record_by_id(newEmployeeId);
        // When
        await benefitsPage.goto();
        await expect(benefitsPage.employeesTableRows).not.toHaveCount(0)
        await employee.clickEdit()
        await benefitsPage.newEmployeeModal.updateEmployee(firstName, lastName, dependents)
        // Then
        await expect.soft(employee.firstName).toHaveText(firstName);
        await expect.soft(employee.lastName).toHaveText(lastName);
        await expect.soft(employee.dependents).toHaveText(dependents.toString());
        await expect.soft(employee.salary).toHaveText(salary.toString());
        await expect.soft(employee.grossPay).toHaveText(grossPay.toString());
        await expect.soft(employee.benefitsCost).toHaveText(benefitsCost.toString());
        await expect.soft(employee.netPay).toHaveText(netPay.toString());
    });

    [
        {
            testName: "empty",
            firstName: "",
            errorMessage: "The firstName field is required.",
        },
        {
            testName: "longer than 50 symbols",
            firstName: "too_long_name_too_long_name_too_long_name_too_long1",
            errorMessage: "The field firstName must be a string with a maximum length of 50.",
        },
    ].forEach(({ testName, firstName, errorMessage }) => {
        test(`should not add update an employee when First Name is incorrect (${testName})`, async ({ newEmployeeId, benefitsPage }) => {
            // Given
            const lastName = "Tester"
            const dependents = 1;

            const employee = await benefitsPage.get_employee_record_by_id(newEmployeeId);
            // When
            await benefitsPage.goto();
            await expect(benefitsPage.employeesTableRows).not.toHaveCount(0)
            await employee.clickEdit()
            await benefitsPage.newEmployeeModal.updateEmployee(firstName, lastName, dependents)
            // Then
            await expect(benefitsPage.newEmployeeModal.errorMessage).toHaveText(errorMessage);
        });
    });

    [
        {
            testName: "empty",
            lastName: "",
            errorMessage: "The lastName field is required.",
        },
        {
            testName: "longer than 50 symbols",
            lastName: "too_long_name_too_long_name_too_long_name_too_long1",
            errorMessage: "The field lastName must be a string with a maximum length of 50.",
        },
    ].forEach(({ testName, lastName, errorMessage }) => {
        test(`should not update an employee when Last Name is incorrect (${testName})`, async ({newEmployeeId, benefitsPage}) => {
            // Given
            const firstName = "Honza"
            const dependents = 1;

            const employee = await benefitsPage.get_employee_record_by_id(newEmployeeId);
            // When
            await benefitsPage.goto();
            await expect(benefitsPage.employeesTableRows).not.toHaveCount(0)
            await employee.clickEdit()
            await benefitsPage.newEmployeeModal.updateEmployee(firstName, lastName, dependents)
            // Then
            await expect(benefitsPage.newEmployeeModal.errorMessage).toHaveText(errorMessage);
        });
    });

    [
        {
            testName: "less than 0",
            dependents: -1,
            errorMessage: "The field dependants must be between 0 and 32.",
        },
        {
            testName: "more than 32",
            dependents: 33,
            errorMessage: "The field dependants must be between 0 and 32.",
        },
    ].forEach(({ testName, dependents, errorMessage }) => {
        test(`should not update an employee when dependents field is incorrect (${testName})`, async ({newEmployeeId, benefitsPage}) => {
            // Given
            const firstName = "Honza";
            const lastName = "Tester";

            const employee = await benefitsPage.get_employee_record_by_id(newEmployeeId);
            // When
            await benefitsPage.goto();
            await expect(benefitsPage.employeesTableRows).not.toHaveCount(0)
            await employee.clickEdit()
            await benefitsPage.newEmployeeModal.updateEmployee(firstName, lastName, dependents)
            // Then
            await expect(benefitsPage.newEmployeeModal.errorMessage).toHaveText(errorMessage);
        });
    });
});

test.describe(`Benefits Dashboard tests - delete employee`, () => {

    test(`should delete an employee`, async ({newEmployeeId, benefitsPage}) => {
        // Given
        const employee = await benefitsPage.get_employee_record_by_id(newEmployeeId);
        // When
        await benefitsPage.goto();
        await expect(benefitsPage.employeesTableRows).not.toHaveCount(0);
        await benefitsPage.deleteEmployee(employee)
        // Then
        await expect(employee.element).toHaveCount(0)
    });

});