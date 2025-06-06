/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Department } from '../models/Department';
import type { DepartmentTreeNode } from '../models/DepartmentTreeNode';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DepartmentsService {
    /**
     * Get Department Tree
     * Retrieves the entire department hierarchy as a tree structure.
     * Root nodes are departments where dept_parentcode is None.
     * @returns DepartmentTreeNode Successful Response
     * @throws ApiError
     */
    public static getDepartmentTreeApiV1DepartmentsTreeGet(): CancelablePromise<Array<DepartmentTreeNode>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/departments/tree',
        });
    }
    /**
     * List Departments
     * @param skip
     * @param limit
     * @returns Department Successful Response
     * @throws ApiError
     */
    public static listDepartmentsApiV1DepartmentsGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<Department>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/departments/',
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
     * Get Department
     * @param departmentId
     * @returns Department Successful Response
     * @throws ApiError
     */
    public static getDepartmentApiV1DepartmentsDepartmentIdGet(
        departmentId: number,
    ): CancelablePromise<Department> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/departments/{department_id}',
            path: {
                'department_id': departmentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Department Subdepartment Ids
     * @param deptCode
     * @returns number Successful Response
     * @throws ApiError
     */
    public static getDepartmentSubdepartmentIdsApiV1DepartmentsDeptCodeSubdepartmentIdsGet(
        deptCode: number,
    ): CancelablePromise<Array<number>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/departments/{dept_code}/subdepartment-ids',
            path: {
                'dept_code': deptCode,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
