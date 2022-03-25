import { Address } from "./address";

export type Appointment = {
    appointmentId?: number;
    doctorId: number;
    doctorDetails?: {
        name: string;
        email: string;
    };
    patientId: number;
    patientDetails?: {
        name: string;
        email: string;
    };
    startDate: Date;
    endDate: Date;
    address: Address;
};
