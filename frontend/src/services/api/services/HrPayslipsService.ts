/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PayslipCreate } from '../models/PayslipCreate';
import type { PayslipInDB } from '../models/PayslipInDB';
import type { PayslipUpdate } from '../models/PayslipUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HrPayslipsService {
    /**
     * Create Payslip
     * Create a new payslip.
     * @param requestBody
     * @returns PayslipInDB Successful Response
     * @throws ApiError
     */
    public static createPayslipApiV1HrPayslipsPost(
        requestBody: PayslipCreate,
    ): CancelablePromise<PayslipInDB> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/hr-payslips/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Payslips
     * Retrieve payslips.
     * @param skip
     * @param limit
     * @returns PayslipInDB Successful Response
     * @throws ApiError
     */
    public static readPayslipsApiV1HrPayslipsGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<PayslipInDB>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-payslips/',
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
     * Read Payslip
     * Get payslip by ID.
     * @param payslipId
     * @returns PayslipInDB Successful Response
     * @throws ApiError
     */
    public static readPayslipApiV1HrPayslipsPayslipIdGet(
        payslipId: number,
    ): CancelablePromise<PayslipInDB> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/hr-payslips/{payslip_id}',
            path: {
                'payslip_id': payslipId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Payslip
     * Update a payslip.
     * @param payslipId
     * @param requestBody
     * @returns PayslipInDB Successful Response
     * @throws ApiError
     */
    public static updatePayslipApiV1HrPayslipsPayslipIdPut(
        payslipId: number,
        requestBody: PayslipUpdate,
    ): CancelablePromise<PayslipInDB> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/hr-payslips/{payslip_id}',
            path: {
                'payslip_id': payslipId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Payslip
     * Delete a payslip.
     * @param payslipId
     * @returns PayslipInDB Successful Response
     * @throws ApiError
     */
    public static deletePayslipApiV1HrPayslipsPayslipIdDelete(
        payslipId: number,
    ): CancelablePromise<PayslipInDB> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/hr-payslips/{payslip_id}',
            path: {
                'payslip_id': payslipId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
