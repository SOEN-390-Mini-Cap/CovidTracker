import { Address } from "./address";
import { Gender } from "./gender";
import { Role } from "./role";

export interface User {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    roles: Role[];
    address?: Address;
    gender?: Gender;
    password?: string;
    createdOn?: Date;
}
