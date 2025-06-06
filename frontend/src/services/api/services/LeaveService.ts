/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LeaveCreate } from '../models/LeaveCreate';
import type { LeaveInDB } from '../models/LeaveInDB';
import type { LeaveStatus } from '../models/LeaveStatus';
import type { LeaveUpdate } from '../models/LeaveUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LeaveService {
    /**
     * Create Leave
     * @param requestBody
     * @returns LeaveInDB Successful Response
     * @throws ApiError
     */
    public static createLeaveApiV1LeavePost(
        requestBody: LeaveCreate,
    ): CancelablePromise<LeaveInDB> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/leave/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Leaves
     * @param skip
     * @param limit
     * @param employeeId
     * @param status
     * @returns LeaveInDB Successful Response
     * @throws ApiError
     */
    public static readLeavesApiV1LeaveGet(
        skip?: number,
        limit: number = 100,
        employeeId?: (number | null),
        status?: (LeaveStatus | null),
    ): CancelablePromise<Array<LeaveInDB>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/leave/',
            query: {
                'skip': skip,
                'limit': limit,
                'employee_id': employeeId,
                'status': status,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Leave
     * @param leaveId
     * @param requestBody
     * @returns LeaveInDB Successful Response
     * @throws ApiError
     */
    public static updateLeaveApiV1LeaveLeaveIdPut(
        leaveId: number,
        requestBody: LeaveUpdate,
    ): CancelablePromise<LeaveInDB> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/leave/{leave_id}',
            path: {
                'leave_id': leaveId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Approve Leave
     * @param leaveId
     * @returns LeaveInDB Successful Response
     * @throws ApiError
     */
    public static approveLeaveApiV1LeaveLeaveIdApprovePost(
        leaveId: number,
    ): CancelablePromise<LeaveInDB> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/leave/{leave_id}/approve',
            path: {
                'leave_id': leaveId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
