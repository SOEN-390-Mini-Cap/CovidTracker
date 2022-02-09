export enum Role {
    USER = "USER",
    PATIENT = "PATIENT",
    DOCTOR = "DOCTOR",
    ADMIN = "ADMIN",
    HEALTH_OFFICIAL = "HEALTH_OFFICIAL",
    IMMIGRATION_OFFICER = "IMMIGRATION_OFFICER",
}

export const ROLES = Object.values(Role);

export const roleToIdMap = new Map<Role, number>([
    [Role.USER, 1],
    [Role.PATIENT, 2],
    [Role.DOCTOR, 3],
    [Role.ADMIN, 4],
    [Role.HEALTH_OFFICIAL, 5],
    [Role.IMMIGRATION_OFFICER, 6],
]);
