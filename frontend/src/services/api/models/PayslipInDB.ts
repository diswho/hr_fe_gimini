/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PayslipDetail } from './PayslipDetail';
export type PayslipInDB = {
    employee_id: number;
    pay_period_start_date: string;
    pay_period_end_date: string;
    payment_date: string;
    total_earnings: number;
    total_deductions: number;
    net_pay: number;
    bank_account_number?: (string | null);
    notes?: (string | null);
    id: number;
    details?: (Array<PayslipDetail> | null);
};
