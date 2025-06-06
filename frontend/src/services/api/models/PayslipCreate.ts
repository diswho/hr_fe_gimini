/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PayslipDetailCreate } from './PayslipDetailCreate';
export type PayslipCreate = {
    employee_id: number;
    pay_period_start_date: string;
    pay_period_end_date: string;
    payment_date: string;
    total_earnings: number;
    total_deductions: number;
    net_pay: number;
    bank_account_number?: (string | null);
    notes?: (string | null);
    details?: (Array<PayslipDetailCreate> | null);
};
