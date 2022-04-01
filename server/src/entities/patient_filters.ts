import { TestResultType } from "./test_result_type";

export type PatientFilters = {
    status: TestResultType;
    traceTarget: number;
    testDateFrom: Date;
    testDateTo: Date;
};
