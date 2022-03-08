import { TestResultType } from "./test_result_type";
import { TestType } from "./test_type";
import { Address } from "./address";

export type TestResult = {
    testId: number;
    patientId: number;
    result: TestResultType;
    testType: TestType;
    testDate: Date;
    address: Address;
};
