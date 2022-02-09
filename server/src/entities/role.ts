export enum Role {
    USER = "USER",
    PATIENT = "PATIENT",
    DOCTOR = "DOCTOR",
    ADMIN = "ADMIN",
    HEALTH_OFFICIAL = "HEALTH_OFFICIAL",
    IMMIGRATION_OFFICER = "IMMIGRATION_OFFICER",
}

export const ROLES = Object.values(Role);

export const roleToIdMap: Record<string, number> = {
    USER: 1,
    PATIENT: 2,
    DOCTOR: 3,
    ADMIN: 4,
    HEALTH_OFFICIAL: 5,
    IMMIGRATION_OFFICER: 6,
};
