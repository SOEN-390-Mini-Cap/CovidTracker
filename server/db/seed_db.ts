import "dotenv/config";
import { Pool } from "pg";
import { users } from "./seed_data/user_data";
import * as bcrypt from "bcrypt";
import { addresses } from "./seed_data/address_data";
import { UserRepository } from "../src/repositories/user_repository";
import { DoctorRepository } from "../src/repositories/doctor_repository";
import { PatientRepository } from "../src/repositories/patient_repository";
import { AdminRepository } from "../src/repositories/admin_repository";
import { StatusRepository } from "../src/repositories/status_repository";
import { HealthOfficialRepository } from "../src/repositories/health_official_repository";
import faker from "@faker-js/faker";
import {Address} from "../src/entities/address";
import {User} from "../src/entities/user";
import {Gender} from "../src/entities/gender";
import {RequestUser} from "../src/entities/request/RequestUser";

export async function seedDb(): Promise<void> {
    // const pool = new Pool();
    // const userRepository = new UserRepository(pool);
    // const doctorRepository = new DoctorRepository(pool, userRepository);
    // const patientRepository = new PatientRepository(pool, userRepository);
    // const adminRepository = new AdminRepository(pool, userRepository);
    // const statusRepository = new StatusRepository(pool);
    // const healthOfficialRepository = new HealthOfficialRepository(pool, userRepository);

    faker.setLocale("en_CA");

    const numAddresses = 20;
    // insert addresses
    for (let i = 0; i < numAddresses; i++) {
        const isEveryFifth = i % 5 === 0;

        const address: Address = {
            addressId: null,
            streetAddress: faker.address.streetAddress(),
            streetAddressLineTwo: isEveryFifth ? faker.address.secondaryAddress() : "",
            city: faker.address.city(),
            postalCode: faker.address.zipCode(),
            province: faker.address.state(),
            country: "Canada",
        };

        // await userRepository.addAddress(address);
    }

    const numPatients = 900;
    const numDoctors = 90;
    const numAdmins = 1;
    const numHealthOfficials = 1;
    const numImmigrationOfficers = 1;

    const numUsers = numPatients + numDoctors + numAdmins + numHealthOfficials + numImmigrationOfficers;
    for (let i = 0; i < numUsers; i++) {
        const rawGender = faker.name.gender(true);
        const firstName = faker.name.firstName(rawGender);
        const lastName = faker.name.lastName(rawGender);
        const email = faker.internet.email(firstName, lastName);

        const user: RequestUser = {
            email,
            password: await bcrypt.hash("Test123!", 10),
            firstName,
            lastName,
            phoneNumber: faker.phone.phoneNumber(),
            gender: rawGender === "Male" ? Gender.MALE : Gender.FEMALE,
            dateOfBirth: faker.date.between("1920-01-01T00:00:00.000Z", "2000-01-01T00:00:00.000Z"),
        };
        const addressId = faker.datatype.number({ min: 0, max: numAddresses - 1 });

        // await userRepository.addUser(user, addressId);
    }

    // // add addresses
    // for (const address of addresses) {
    //     await userRepository.addAddress(address);
    // }
    //
    // // add users
    // for (const { userData, addressId } of users) {
    //     await userRepository.addUser(
    //         {
    //             ...userData,
    //             password: await bcrypt.hash(userData.password, 10),
    //         },
    //         addressId,
    //     );
    // }
    //
    // // add doctors
    // await doctorRepository.addDoctor(1);
    // await doctorRepository.addDoctor(2);
    //
    // // add patients
    // await patientRepository.addPatient(3);
    // await patientRepository.addPatient(4);
    // await patientRepository.addPatient(5);
    //
    // // add admin
    // await adminRepository.addAdmin(6);
    //
    // // add health official
    // await healthOfficialRepository.addHealthOfficial(7);
    //
    // // assign patient to doctor
    // await patientRepository.updateAssignedDoctor(3, 1);
    // await patientRepository.updateAssignedDoctor(5, 2);
    //
    // // add status fields
    // await statusRepository.updateStatusFields(3, {
    //     temperature: true,
    //     weight: true,
    //     fever: true,
    //     cough: false,
    //     shortnessOfBreath: false,
    //     lossOfTasteAndSmell: true,
    //     nausea: false,
    //     stomachAches: false,
    //     vomiting: false,
    //     headache: false,
    //     musclePain: false,
    //     soreThroat: false,
    //     otherSymptoms: true,
    // });
    //
    // await statusRepository.updateStatusFields(5, {
    //     temperature: true,
    //     weight: true,
    //     fever: true,
    //     cough: false,
    //     shortnessOfBreath: false,
    //     lossOfTasteAndSmell: true,
    //     nausea: false,
    //     stomachAches: false,
    //     vomiting: false,
    //     headache: false,
    //     musclePain: false,
    //     soreThroat: false,
    //     otherSymptoms: true,
    // });
    //
    // // add status reports
    // await statusRepository.insertStatus(3, {
    //     weight: 150,
    //     temperature: 29,
    //     fever: true,
    //     cough: false,
    //     shortnessOfBreath: false,
    //     lossOfTasteAndSmell: true,
    //     nausea: false,
    //     stomachAches: false,
    //     vomiting: false,
    //     headache: false,
    //     musclePain: false,
    //     soreThroat: false,
    //     otherSymptoms: "No other symptoms",
    // });
    //
    // await pool.end();
}
