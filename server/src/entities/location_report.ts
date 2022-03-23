import { Address } from "./address";

export type LocationReport = {
    locationReportId?: number;
    patientId: number;
    address: Address;
    createdOn: Date;
};
