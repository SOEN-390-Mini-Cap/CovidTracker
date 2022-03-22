import { Address } from "./address";

export type Appointment = {
    appointmentId?: number;
    doctorId: number;
    patientId: number;
    startDate: Date;
    endDate: Date;
    address: Address;
};
