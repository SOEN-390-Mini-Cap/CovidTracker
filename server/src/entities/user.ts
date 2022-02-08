import { Address } from "./address";
import { Gender } from "./gender";
import { Role } from "./role";
import { Account } from "./account";

export interface User {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: Gender;
    dateOfBirth: Date;
    role: Role;
    address: Address;
    account: Account;
}
