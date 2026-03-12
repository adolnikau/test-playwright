import {type Locator} from "@playwright/test";

export class EmployeeRecord {
    static readonly SELECTORS = {
        id: "xpath=./td[1]",
        firstName: "xpath=./td[2]",
        lastName: "xpath=./td[3]",
        dependents: "xpath=./td[4]",
        salary: "xpath=./td[5]",
        grossPay: "xpath=./td[6]",
        benefitsCost: "xpath=./td[7]",
        netPay: "xpath=./td[8]",
    };

    readonly element: Locator;
    readonly id: Locator;
    readonly lastName: Locator;
    readonly firstName: Locator;
    readonly dependents: Locator;
    readonly salary: Locator;
    readonly grossPay: Locator;
    readonly benefitsCost: Locator;
    readonly netPay: Locator;
    readonly editBtn: Locator;
    readonly deleteBtn: Locator;

    constructor(element: Locator) {
        this.element = element;
        this.id = element.locator(EmployeeRecord.SELECTORS.id)
        this.firstName = element.locator(EmployeeRecord.SELECTORS.firstName)
        this.lastName = element.locator(EmployeeRecord.SELECTORS.lastName)
        this.dependents = element.locator(EmployeeRecord.SELECTORS.dependents)
        this.salary = element.locator(EmployeeRecord.SELECTORS.salary)
        this.grossPay = element.locator(EmployeeRecord.SELECTORS.grossPay)
        this.benefitsCost = element.locator(EmployeeRecord.SELECTORS.benefitsCost)
        this.netPay = element.locator(EmployeeRecord.SELECTORS.netPay)
        this.editBtn = element.locator("//i[contains(@class, 'fa-edit')]")
        this.deleteBtn = element.locator("//i[contains(@class, 'fa-times')]")
    }

    async clickDelete() {
        await this.deleteBtn.click();
    }

    async clickEdit() {
        await this.editBtn.click();
    }

    filterBy(field: keyof typeof EmployeeRecord.SELECTORS, text: string): EmployeeRecord {
        return new EmployeeRecord(
            this.element
                .filter({ has: this.element.page().locator(EmployeeRecord.SELECTORS[field], { hasText: text }) })
        );
    }

    first(): EmployeeRecord {
        return new EmployeeRecord(this.element.first());
    }


}