import { TestResultType } from "./test_result_type";

export type TestResult = {
    patientId: number;
    testResult: TestResultType;
    testType: string;
    testDate: Date;
    addressId: number;
};
