/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PayslipDetailCreate } from '../models/PayslipDetailCreate';
import type { PayslipDetailInDB } from '../models/PayslipDetailInDB';
import type { PayslipDetailUpdate } from '../models/PayslipDetailUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HrPayslipDetailsService {
    /**
     * Create Payslip Detail
     * Create a new payslip detail.
     * @param requestBody
     * @returns PayslipDetailInDB Successful Response
     * @throws ApiError
     */
    public static createPayslipDetailApiV1HrPayslipDetailsPost(
        requestBody: PayslipDetailCreate,
    ): CancelablePromise<PayslipDetailInDB> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/hr-payslip-details/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Payslip Details
     * Retrieve payslip details.
     * @param skip
     * @param limit
     * @returns PayslipDetailInDB Successful Response
     * @throws ApiError
     */
    public static readPayslipDetailsApiV1HrPayslipDetailsGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<PayslipDetailInDB>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-payslip-details/',
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
     * Read Payslip Detail
     * Get payslip detail by ID.
     * @param payslipDetailId
     * @returns PayslipDetailInDB Successful Response
     * @throws ApiError
     */
    public static readPayslipDetailApiV1HrPayslipDetailsPayslipDetailIdGet(
        payslipDetailId: number,
    ): CancelablePromise<PayslipDetailInDB> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-payslip-details/{payslip_detail_id}',
            path: {
                'payslip_detail_id': payslipDetailId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Payslip Detail
     * Update a payslip detail.
     * @param payslipDetailId
     * @param requestBody
     * @returns PayslipDetailInDB Successful Response
     * @throws ApiError
     */
    public static updatePayslipDetailApiV1HrPayslipDetailsPayslipDetailIdPut(
        payslipDetailId: number,
        requestBody: PayslipDetailUpdate,
    ): CancelablePromise<PayslipDetailInDB> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/hr-payslip-details/{payslip_detail_id}',
            path: {
                'payslip_detail_id': payslipDetailId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Payslip Detail
     * Delete a payslip detail.
     * @param payslipDetailId
     * @returns PayslipDetailInDB Successful Response
     * @throws ApiError
     */
    public static deletePayslipDetailApiV1HrPayslipDetailsPayslipDetailIdDelete(
        payslipDetailId: number,
    ): CancelablePromise<PayslipDetailInDB> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/hr-payslip-details/{payslip_detail_id}',
            path: {
                'payslip_detail_id': payslipDetailId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
