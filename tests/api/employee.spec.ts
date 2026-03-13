import { test, expect } from "./fixtures"
import { EmployeeListSchema, EmployeeRequest, EmployeeSchema } from "../../src/api/models/employee";
import { Benefits } from "../../src/utils/benefits";
import { ValidationErrorListSchema } from "../../src/api/models/error";


test.describe(`Test Employees POST request`, () => {

    test(`should create an employee when minimum fields are passed`, async ({ createEmployee }) => {
        // Given
        const request: EmployeeRequest = {
            username: "TestCreateUsername",
            firstName: "Create First Name",
            lastName: "Create Last Name",
        }
        // And date that 1 month forward where time is omitted for stability
        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
        const expectedDate = oneMonthFromNow.toISOString().split('T')[0];
        // When
        const result = await createEmployee(request);
        const response = result[0]
        const employee = result[1]
        // Then
        expect(response.status()).toBe(200)
        expect.soft(employee.username).toBe(request.username);
        expect.soft(employee.firstName).toBe(request.firstName);
        expect.soft(employee.lastName).toBe(request.lastName);
        expect.soft(employee.dependants).toBe(0);
        // And default values should be filled up
        expect.soft(employee.salary).toBe(Benefits.salary())
        expect.soft(employee.gross).toBe(Benefits.BASE_PAYCHECK)
        expect.soft(employee.benefitsCost).toBeCloseTo(Benefits.benefitsCostsPerPaycheck(0))
        expect.soft(employee.net).toBeCloseTo(Benefits.net_paycheck(0))
        expect(employee.expiration).toBeDefined()
        expect.soft(employee.expiration.split('T')[0]).toBe(expectedDate)
    });

    test(`should create an employee when all fields are passed`, async ({ createEmployee }) => {
        // Given
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        const expirationDate = oneYearFromNow.toISOString();
        const paycheck = 3000
        const request: EmployeeRequest = {
            username: "TestFullCreateUsername",
            firstName: "CreateFull First Name",
            lastName: "CreateFull Last Name",
            dependants: 4,
            salary: Benefits.salary(paycheck),
            expiration: expirationDate
        }
        // When
        const result = await createEmployee(request);
        const response = result[0]
        const employee = result[1]
        // Then
        expect(response.status()).toBe(200)
        expect.soft(employee.username).toBe(request.username);
        expect.soft(employee.firstName).toBe(request.firstName);
        expect.soft(employee.lastName).toBe(request.lastName);
        expect.soft(employee.dependants).toBe(request.dependants);
        expect.soft(employee.salary).toBe(request.salary)
        expect.soft(employee.gross).toBe(paycheck)
        expect.soft(employee.benefitsCost).toBeCloseTo(Benefits.benefitsCostsPerPaycheck(request.dependants))
        expect.soft(employee.net).toBeCloseTo(Benefits.net_paycheck(request.dependants, paycheck))
        expect.soft(new Date(employee.expiration).toISOString()).toBe(expirationDate)
    });

    test(`should not create an employee when no fields are passed`, async ({ createEmployee }) => {
        // Given
        const request = {} as EmployeeRequest
        // When
        const result = await createEmployee(request);
        const response = result[0]
        // Then
        expect(response.status()).toBe(400)
        const errorMessages = ValidationErrorListSchema.parse(await response.json());
        expect.soft(errorMessages).toContainEqual({"errorMessage": "The firstName field is required.", "memberNames": ["firstName"]})
        expect.soft(errorMessages).toContainEqual({"errorMessage": "The lastName field is required.", "memberNames": ["lastName"]})
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
    ].forEach(({ testName, firstName, errorMessage }) =>
    {
        test(`should not create an employee when firstName is invalid (${testName})`, async ({createEmployee}) => {
            // Given
            const request: EmployeeRequest = {
                username: "TestInvalidUsername",
                firstName: firstName,
                lastName: "Create Last Name",
                dependants: 1,
            }
            // When
            const result = await createEmployee(request);
            const response = result[0]
            // Then
            expect(response.status()).toBe(400)
            const errorMessages = ValidationErrorListSchema.parse(await response.json());
            expect(errorMessages).toContainEqual({errorMessage: errorMessage, memberNames: ["firstName"]})
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
    ].forEach(({ testName, lastName, errorMessage }) =>
    {
        test(`should not create an employee when lastName is invalid (${testName})`, async ({createEmployee}) => {
            // Given
            const request: EmployeeRequest = {
                username: "TestInvalidUsername",
                firstName: "Create First Name",
                lastName: lastName,
                dependants: 1,
            }
            // When
            const result = await createEmployee(request);
            const response = result[0]
            // Then
            expect(response.status()).toBe(400)
            const errorMessages = ValidationErrorListSchema.parse(await response.json());
            expect(errorMessages).toContainEqual({errorMessage: errorMessage, memberNames: ["lastName"]})
        });
    });

    [
        {
            testName: "less than 0",
            dependants: -1,
            errorMessage: "The field dependants must be between 0 and 32.",
        },
        {
            testName: "more than 32",
            dependants: 33,
            errorMessage: "The field dependants must be between 0 and 32.",
        },
    ].forEach(({ testName, dependants, errorMessage }) =>
    {
        test(`should not create an employee when dependants number is invalid (${testName})`, async ({createEmployee}) => {
            // Given
            const request: EmployeeRequest = {
                username: "TestInvalidUsername",
                firstName: "Create First Name",
                lastName: "Create Last Name",
                dependants: dependants,
            }
            // When
            const result = await createEmployee(request);
            const response = result[0]
            // Then
            expect(response.status()).toBe(400)
            const errorMessages = ValidationErrorListSchema.parse(await response.json());
            expect(errorMessages).toContainEqual({errorMessage: errorMessage, memberNames: ["dependants"]})
        });
    });

    test(`should not create an employee when salary is less than 0`, async ({createEmployee}) => {
        // Given
        const request: EmployeeRequest = {
            username: "TestInvalidUsername",
            firstName: "Create First Name",
            lastName: "Create Last Name",
            dependants: 1,
            salary: -100
        }
        // When
        const result = await createEmployee(request);
        const response = result[0]
        // Then
        expect(response.status()).toBe(400)
        const errorMessages = ValidationErrorListSchema.parse(await response.json());
        expect(errorMessages).toContainEqual({errorMessage: "The salary dependants must be bigger than 0", memberNames: ["salary"]})
    });

    test(`should not create an employee when expiration is in the past`, async ({createEmployee}) => {
        // Given
        const oneMonthBefore = new Date();
        oneMonthBefore.setFullYear(oneMonthBefore.getFullYear() - 1);
        const expirationDate = oneMonthBefore.toISOString();
        const request: EmployeeRequest = {
            username: "TestInvalidUsername",
            firstName: "Create First Name",
            lastName: "Create Last Name",
            dependants: 1,
            expiration: expirationDate,
        }
        // When
        const result = await createEmployee(request);
        const response = result[0]
        // Then
        expect(response.status()).toBe(400)
        const errorMessages = ValidationErrorListSchema.parse(await response.json());
        expect(errorMessages).toContainEqual({errorMessage: "The expiration date must not be in the past", memberNames: ["expiration"]})
    });
});


test.describe(`Test Employees DELETE request`, () => {

    test(`should delete an employee`, async ({employeesApi}) => {
        // Given
        const newEmployee: EmployeeRequest = {
            username: "TestDeleteUsername",
            firstName:  'Delete First Name',
            lastName:   'Delete Last Name',
            dependants: 6,
        };
        const created_response = await employeesApi.post(newEmployee);
        const created = EmployeeSchema.parse(await created_response.json());
        // When
        const response = await employeesApi.delete(created.id)
        // Then
        expect(response.status()).toBe(200);
        const allResponse = await employeesApi.getAll();
        const employees = EmployeeListSchema.parse(await allResponse.json());
        expect(employees.some(e => e.id === created.id)).toBe(false);
    });

    test(`should return an error when trying to delete an employee with incorrect id`, async ({employeesApi}) => {
        // Given
        const incorrectId = "incorrect_id"
        // When
        const response = await employeesApi.delete(incorrectId)
        // Then
        expect(response.status()).toBe(405);
    });

});

test.describe(`Test Employees GET request`, () => {

    test(`should get all employees`, async ({newTestEmployee, employeesApi}) => {
        // Given
        const expectedEmployee = newTestEmployee[1]
        // When
        const response = await employeesApi.getAll();
        // Then
        expect(response.status()).toBe(200);
        const allEmployees = EmployeeListSchema.parse(await response.json());
        expect(allEmployees.length).toBeGreaterThan(0);
        expect(allEmployees.some(e => e.id === expectedEmployee.id)).toBe(true);
    });

    test(`should get one employee when provided an id`, async ({newTestEmployee, employeesApi}) => {
        // Given
        const expectedEmployee = newTestEmployee[1]
        // When
        const response = await employeesApi.getById(expectedEmployee.id);
        // Then
        expect(response.status()).toBe(200);
        const actualEmployee = EmployeeSchema.parse(await response.json());
        expect(actualEmployee.id).toBe(expectedEmployee.id);
    })

    test(`should get no employee when provided a wrong id`, async ({employeesApi}) => {
        // Given
        const incorrectId = "incorrect_id"
        // When
        const response = await employeesApi.getById(incorrectId);
        // Then
        expect(response.status()).toBe(200);
        expect(await response.json()).toBe({});
    })

});

test.describe(`Test Employees PUT request`, () => {

    test(`should update an employee`, async ({newTestEmployee, employeesApi}) => {
        // Given
        const id = newTestEmployee[1].id
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        const expirationDate = oneYearFromNow.toISOString();
        const paycheck = 3000
        const requestBody: EmployeeRequest = {
            id: id,
            username: "TestUpdateUsername",
            firstName: "Update First Name",
            lastName: "Update Last Name",
            dependants: 7,
            salary: Benefits.salary(paycheck),
            expiration: expirationDate
        }
        // When
        const response = await employeesApi.put(requestBody);
        // Then
        expect(response.status()).toBe(200);
        const updatedResponse = await employeesApi.getById(requestBody.id)
        const employee = EmployeeSchema.parse(await updatedResponse.json());
        expect(response.status()).toBe(200)
        expect.soft(employee.username).toBe(requestBody.username);
        expect.soft(employee.firstName).toBe(requestBody.firstName);
        expect.soft(employee.lastName).toBe(requestBody.lastName);
        expect.soft(employee.dependants).toBe(requestBody.dependants);
        expect.soft(employee.salary).toBe(requestBody.salary)
        expect.soft(employee.gross).toBe(requestBody.salary / Benefits.PAYCHECKS_AMOUNT)
        expect.soft(employee.benefitsCost).toBeCloseTo(Benefits.benefitsCostsPerPaycheck(requestBody.dependants))
        expect.soft(employee.net).toBeCloseTo(Benefits.net_paycheck(requestBody.dependants, paycheck))
        expect.soft(new Date(employee.expiration).toISOString()).toBe(expirationDate)
    });

    test(`should not update an employee when no fields are passed`, async ({newTestEmployee, employeesApi}) => {
        // Given
        const id = newTestEmployee[1].id
        const request = {id: id} as EmployeeRequest
        // When
        const response = await employeesApi.put(request)
        // Then
        expect(response.status()).toBe(400)
        const errorMessages = ValidationErrorListSchema.parse(await response.json());
        expect.soft(errorMessages).toContainEqual({"errorMessage": "The firstName field is required.", "memberNames": ["firstName"]})
        expect.soft(errorMessages).toContainEqual({"errorMessage": "The lastName field is required.", "memberNames": ["lastName"]})
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
        test(`should not update an employee when firstName is invalid (${testName})`, async ({newTestEmployee, employeesApi}) => {
            // Given
            const id = newTestEmployee[1].id
            const requestBody: EmployeeRequest = {
                id: id,
                username: "TestUpdateUsername",
                firstName: firstName,
                lastName: "Update Last Name",
                dependants: 7,
            }
            // When
            const response = await employeesApi.put(requestBody);
            // Then
            expect(response.status()).toBe(400)
            const errorMessages = ValidationErrorListSchema.parse(await response.json());
            expect(errorMessages).toContainEqual({errorMessage: errorMessage, memberNames: ["firstName"]})
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
        test(`should not update an employee when lastName is invalid (${testName})`, async ({newTestEmployee, employeesApi}) => {
            // Given
            const id = newTestEmployee[1].id
            const requestBody: EmployeeRequest = {
                id: id,
                username: "TestUpdateUsername",
                firstName: "Update First Name",
                lastName: lastName,
                dependants: 7,
            }
            // When
            const response = await employeesApi.put(requestBody);
            // Then
            expect(response.status()).toBe(400)
            const errorMessages = ValidationErrorListSchema.parse(await response.json());
            expect(errorMessages).toContainEqual({errorMessage: errorMessage, memberNames: ["lastName"]})
        });
    });

    [
        {
            testName: "less than 0",
            dependants: -1,
            errorMessage: "The field dependants must be between 0 and 32.",
        },
        {
            testName: "more than 32",
            dependants: 33,
            errorMessage: "The field dependants must be between 0 and 32.",
        },
    ].forEach(({ testName, dependants, errorMessage }) => {
        test(`should not update an employee when dependants number is invalid (${testName})`, async ({newTestEmployee, employeesApi}) => {
            // Given
            const id = newTestEmployee[1].id
            const requestBody: EmployeeRequest = {
                id: id,
                username: "TestInvalidUsername",
                firstName: "Update First Name",
                lastName: "Update Last Name",
                dependants: dependants,
            }
            // When
            const response = await employeesApi.put(requestBody);
            // Then
            expect(response.status()).toBe(400)
            const errorMessages = ValidationErrorListSchema.parse(await response.json());
            expect(errorMessages).toContainEqual({errorMessage: errorMessage, memberNames: ["dependants"]})
        });
    });

    test(`should not update an employee when salary is less than 0`, async ({newTestEmployee, employeesApi}) => {
        // Given
        const id = newTestEmployee[1].id
        const requestBody: EmployeeRequest = {
            id: id,
            username: "TestInvalidUsername",
            firstName: "Update First Name",
            lastName: "Update Last Name",
            dependants: 2,
            salary: -100,
        }
        // When
        const response = await employeesApi.put(requestBody);
        // Then
        expect(response.status()).toBe(400)
        const errorMessages = ValidationErrorListSchema.parse(await response.json());
        expect(errorMessages).toContainEqual({errorMessage: "The salary dependants must be bigger than 0", memberNames: ["salary"]})
    });

    test(`should not update an employee when expiration is in the past`, async ({newTestEmployee, employeesApi}) => {
        // Given
        const oneMonthBefore = new Date();
        oneMonthBefore.setFullYear(oneMonthBefore.getFullYear() - 1);
        const expirationDate = oneMonthBefore.toISOString();
        const id = newTestEmployee[1].id
        const requestBody: EmployeeRequest = {
            id: id,
            username: "TestInvalidUsername",
            firstName: "Update First Name",
            lastName: "Update Last Name",
            dependants: 2,
            expiration: expirationDate
        }
        // When
        const response = await employeesApi.put(requestBody);
        // Then
        expect(response.status()).toBe(400)
        const errorMessages = ValidationErrorListSchema.parse(await response.json());
        expect(errorMessages).toContainEqual({errorMessage: "The expiration date must not be in the past", memberNames: ["expiration"]})
    });

});