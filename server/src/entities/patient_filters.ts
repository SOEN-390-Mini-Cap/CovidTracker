import { TestResultType } from "./test_result_type";

export type PatientFilters = {
    status: TestResultType;
    testDateFrom: Date;
    testDateTo: Date;
};
