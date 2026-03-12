import { type Locator, type Page } from "@playwright/test";
import { HeaderPage } from "./header-page";
import { EmployeeRecord } from "../elements/employee-record";
import { NewEmployeePage } from "./new-employee-page";
import { DeleteModalPage } from "./delete-modal-page";

export class BenefitsPage {
    readonly url = "Benefits"

    readonly page: Page;
    readonly header: HeaderPage
    readonly newEmployeeModal: NewEmployeePage
    readonly deleteEmployeeModal: DeleteModalPage

    readonly employeesTable: Locator;
    readonly employeesTableRows: Locator;
    readonly addEmployeesBtn: Locator;
    readonly employeeRecords: EmployeeRecord;

    constructor(page: Page, header: HeaderPage, newEmployeeModal: NewEmployeePage, deleteEmployeeModal: DeleteModalPage) {
        this.page = page;
        this.header = header
        this.newEmployeeModal = newEmployeeModal;
        this.deleteEmployeeModal = deleteEmployeeModal;

        this.employeesTable = page.getByTestId("employeesTable")
        // This is used to determine whenever page is loaded or not
        this.employeesTableRows = this.employeesTable.locator("//tbody/tr")
        this.addEmployeesBtn = page.getByTestId("add")
        this.employeeRecords = new EmployeeRecord(this.employeesTable.locator("//tbody/tr"))
    }

    async goto() {
        await this.page.goto(this.url)
    }

    async openAddEmployeeModal() {
        await this.addEmployeesBtn.click();
    }

    async deleteEmployee(employee: EmployeeRecord) {
        await employee.clickDelete()
        await this.deleteEmployeeModal.deleteBtn.click();
    }

    async get_employee_record_by_id(id: string): Promise<EmployeeRecord> {
        return this.employeeRecords.filterBy("id", id).first();
    }

    async get_employee_record_by_name(firstName: string): Promise<EmployeeRecord> {
        return this.employeeRecords.filterBy("firstName", firstName).first();
    }

}