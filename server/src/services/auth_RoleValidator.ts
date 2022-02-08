import { Role } from "../entities/role";
import { User } from "../entities/user";

export function auth_RoleValidator(user: User, roles: Role[]): boolean {
    return roles.includes(user.role);
}
