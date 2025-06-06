/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmployeeSalaryCreate } from '../models/EmployeeSalaryCreate';
import type { EmployeeSalaryInDB } from '../models/EmployeeSalaryInDB';
import type { EmployeeSalaryUpdate } from '../models/EmployeeSalaryUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HrEmployeeSalariesService {
    /**
     * Create Employee Salary
     * Create a new employee salary record.
     * @param requestBody
     * @returns EmployeeSalaryInDB Successful Response
     * @throws ApiError
     */
    public static createEmployeeSalaryApiV1HrEmployeeSalariesPost(
        requestBody: EmployeeSalaryCreate,
    ): CancelablePromise<EmployeeSalaryInDB> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/hr-employee-salaries/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Employee Salaries
     * Retrieve employee salaries.
     * @param skip
     * @param limit
     * @returns EmployeeSalaryInDB Successful Response
     * @throws ApiError
     */
    public static readEmployeeSalariesApiV1HrEmployeeSalariesGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<EmployeeSalaryInDB>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-employee-salaries/',
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
     * Read Employee Salary
     * Get employee salary by ID.
     * @param employeeSalaryId
     * @returns EmployeeSalaryInDB Successful Response
     * @throws ApiError
     */
    public static readEmployeeSalaryApiV1HrEmployeeSalariesEmployeeSalaryIdGet(
        employeeSalaryId: number,
    ): CancelablePromise<EmployeeSalaryInDB> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-employee-salaries/{employee_salary_id}',
            path: {
                'employee_salary_id': employeeSalaryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Employee Salary
     * Update an employee salary.
     * @param employeeSalaryId
     * @param requestBody
     * @returns EmployeeSalaryInDB Successful Response
     * @throws ApiError
     */
    public static updateEmployeeSalaryApiV1HrEmployeeSalariesEmployeeSalaryIdPut(
        employeeSalaryId: number,
        requestBody: EmployeeSalaryUpdate,
    ): CancelablePromise<EmployeeSalaryInDB> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/hr-employee-salaries/{employee_salary_id}',
            path: {
                'employee_salary_id': employeeSalaryId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Employee Salary
     * Delete an employee salary.
     * @param employeeSalaryId
     * @returns EmployeeSalaryInDB Successful Response
     * @throws ApiError
     */
    public static deleteEmployeeSalaryApiV1HrEmployeeSalariesEmployeeSalaryIdDelete(
        employeeSalaryId: number,
    ): CancelablePromise<EmployeeSalaryInDB> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/hr-employee-salaries/{employee_salary_id}',
            path: {
                'employee_salary_id': employeeSalaryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
