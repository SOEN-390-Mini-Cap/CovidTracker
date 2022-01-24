export interface User {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    password?: string;
    createdOn?: Date;
}
