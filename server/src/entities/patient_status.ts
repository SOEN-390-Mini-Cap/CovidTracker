import { Status } from "./status";

export type PatientStatus = {
    patientId: number;
    createdOn: Date;
    status: Status;
};
