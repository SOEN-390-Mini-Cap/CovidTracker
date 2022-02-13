export interface PatientCount {
    doctorId: number;
    doctorName: string;
    doctorEmail: string;
    numberOfPatients: number;
}

export type PatientCounts = PatientCount[];
