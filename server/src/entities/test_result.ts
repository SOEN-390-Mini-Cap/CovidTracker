import { TestResultType } from "./test_result_type";
import { TestType } from "./test_type";

export type TestResult = {
    patientId: number;
    result: TestResultType;
    testType: TestType;
    testDate: Date;
    addressId: number;
};
