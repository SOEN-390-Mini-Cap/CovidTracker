import { Status } from "./status";

export type PatientStatus = {
    statusId: number;
    patientId: number;
    createdOn: Date;
    status: Status;
};
