/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LeaveStatus } from './LeaveStatus';
export type LeaveInDB = {
    employee_id: number;
    start_date: string;
    end_date: string;
    leave_type: string;
    reason?: (string | null);
    status?: LeaveStatus;
    approver_id?: (number | null);
    id: number;
};
