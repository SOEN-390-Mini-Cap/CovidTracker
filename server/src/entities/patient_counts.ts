export interface PatientCount {
    doctorId: number;
    doctorName: string;
    doctorEmail: string;
    numberOfPatients: number;
}

export interface PatientCounts {
    total: number;
    average: number;
    counts: PatientCount[];
}
