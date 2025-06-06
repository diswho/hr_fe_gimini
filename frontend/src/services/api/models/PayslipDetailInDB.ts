/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SalaryComponentType } from './SalaryComponentType';
export type PayslipDetailInDB = {
    payslip_id: number;
    component_id: number;
    component_name: string;
    component_type: SalaryComponentType;
    is_earning: boolean;
    amount: number;
    id: number;
};
