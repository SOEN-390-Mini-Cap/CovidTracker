import { Address } from "./address";
import { Gender } from "./gender";
import { Role } from "./role";

export interface User {
    userId: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: Gender;
    dateOfBirth: Date;
    createdOn: Date;
    roles: Role[];
    address: Address;
}
