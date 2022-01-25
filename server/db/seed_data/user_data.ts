import { Gender } from "../../src/entities/gender";

export const users = [
    {
        email: "test@test.com",
        password: "Test123!",
        first_name: "john",
        last_name: "smith",
        phone_number: "514-245-6532",
        gender: Gender.MALE,
        date_of_birth: "2001-01-19T02:26:39.131Z",
    },
    {
        email: "test2@test.com",
        password: "Test123!",
        first_name: "john2",
        last_name: "smith",
        phone_number: "514-245-6532",
        gender: Gender.FEMALE,
        date_of_birth: "2001-01-19T02:26:39.131Z",
    },
];
