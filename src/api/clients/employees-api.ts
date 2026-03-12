import {APIRequestContext, APIResponse} from "@playwright/test";
import {EmployeeResponse} from "../models/employee";

export class EmployeesApi {

    private readonly endpoint = "api/Employees"

    constructor(
        private readonly request: APIRequestContext
    ) {}

    async post(employee: EmployeeResponse): Promise<APIResponse> {
        return await this.request.post(this.endpoint, { data: employee });
    }

    async getAll(): Promise<APIResponse> {
        return await this.request.get(this.endpoint);
    }

    async getById(id: string): Promise<APIResponse> {
        return await this.request.get(`${this.endpoint}/${id}`);
    }

    async put(employee: EmployeeResponse): Promise<APIResponse> {
        return await this.request.put(`${this.endpoint}`, { data: employee });
    }

    async delete(id: string): Promise<APIResponse> {
        return await this.request.delete(`${this.endpoint}/${id}`);
    }

}