import { Address } from "./address";

export type LocationReport = {
    locationReportId?: number;
    userId: number;
    address: Address;
    createdOn: Date;
};
