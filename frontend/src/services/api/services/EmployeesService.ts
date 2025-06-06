/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmployeeInDB } from '../models/EmployeeInDB';
import type { EmployeeUpdate } from '../models/EmployeeUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EmployeesService {
    /**
     * Read Employees
     * @param skip
     * @param limit
     * @returns EmployeeInDB Successful Response
     * @throws ApiError
     */
    public static readEmployeesApiV1EmployeesGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<EmployeeInDB>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/employees/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Employee
     * @param employeeId
     * @returns EmployeeInDB Successful Response
     * @throws ApiError
     */
    public static readEmployeeApiV1EmployeesEmployeeIdGet(
        employeeId: number,
    ): CancelablePromise<EmployeeInDB> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/employees/{employee_id}',
            path: {
                'employee_id': employeeId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Employee
     * @param employeeId
     * @param requestBody
     * @returns EmployeeInDB Successful Response
     * @throws ApiError
     */
    public static updateEmployeeApiV1EmployeesEmployeeIdPut(
        employeeId: number,
        requestBody: EmployeeUpdate,
    ): CancelablePromise<EmployeeInDB> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/employees/{employee_id}',
            path: {
                'employee_id': employeeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
