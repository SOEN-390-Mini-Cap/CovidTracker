export enum Role {
    USER = "user",
    PATIENT = "patient",
    DOCTOR = "doctor",
    ADMIN = "admin",
    HEALTH_OFFICIAL = "healthOfficial",
    IMMIGRATION_OFFICER = "immigrationOfficer",
}
export const ROLES = Object.values(Role);
export type RoleString = `${Role}`;
