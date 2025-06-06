/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SalaryComponentCreate } from '../models/SalaryComponentCreate';
import type { SalaryComponentInDB } from '../models/SalaryComponentInDB';
import type { SalaryComponentUpdate } from '../models/SalaryComponentUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HrSalaryComponentsService {
    /**
     * Create Salary Component
     * Create a new salary component.
     * @param requestBody
     * @returns SalaryComponentInDB Successful Response
     * @throws ApiError
     */
    public static createSalaryComponentApiV1HrSalaryComponentsPost(
        requestBody: SalaryComponentCreate,
    ): CancelablePromise<SalaryComponentInDB> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/hr-salary-components/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Salary Components
     * Retrieve salary components.
     * @param skip
     * @param limit
     * @returns SalaryComponentInDB Successful Response
     * @throws ApiError
     */
    public static readSalaryComponentsApiV1HrSalaryComponentsGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<SalaryComponentInDB>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-salary-components/',
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
     * Read Salary Component
     * Get salary component by ID.
     * @param componentId
     * @returns SalaryComponentInDB Successful Response
     * @throws ApiError
     */
    public static readSalaryComponentApiV1HrSalaryComponentsComponentIdGet(
        componentId: number,
    ): CancelablePromise<SalaryComponentInDB> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-salary-components/{component_id}',
            path: {
                'component_id': componentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Salary Component
     * Update a salary component.
     * @param componentId
     * @param requestBody
     * @returns SalaryComponentInDB Successful Response
     * @throws ApiError
     */
    public static updateSalaryComponentApiV1HrSalaryComponentsComponentIdPut(
        componentId: number,
        requestBody: SalaryComponentUpdate,
    ): CancelablePromise<SalaryComponentInDB> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/hr-salary-components/{component_id}',
            path: {
                'component_id': componentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Salary Component
     * Delete a salary component.
     * @param componentId
     * @returns SalaryComponentInDB Successful Response
     * @throws ApiError
     */
    public static deleteSalaryComponentApiV1HrSalaryComponentsComponentIdDelete(
        componentId: number,
    ): CancelablePromise<SalaryComponentInDB> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/hr-salary-components/{component_id}',
            path: {
                'component_id': componentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
