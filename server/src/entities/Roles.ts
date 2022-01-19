export enum Roles {
    User = "user",
    Patient = "patient",
    Doctor = "doctor",
    Admin = "admin",
    HealthOfficial = "healthOfficial",
    ImmigrationOfficer = "immigrationOfficer",
}
export const ROLES = Object.values(Roles);
export type Role = `${Roles}`;
