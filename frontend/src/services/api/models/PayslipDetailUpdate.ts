/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SalaryComponentType } from './SalaryComponentType';
export type PayslipDetailUpdate = {
    payslip_id?: (number | null);
    component_id?: (number | null);
    component_name?: (string | null);
    component_type?: (SalaryComponentType | null);
    is_earning?: (boolean | null);
    amount?: (number | null);
};
