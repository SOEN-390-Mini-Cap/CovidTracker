import "dotenv/config";
import { Pool } from "pg";
import * as bcrypt from "bcrypt";
import { UserRepository } from "../src/repositories/user_repository";
import { DoctorRepository } from "../src/repositories/doctor_repository";
import { PatientRepository } from "../src/repositories/patient_repository";
import { AdminRepository } from "../src/repositories/admin_repository";
import { StatusRepository } from "../src/repositories/status_repository";
import { HealthOfficialRepository } from "../src/repositories/health_official_repository";
import faker from "@faker-js/faker";
import { Address } from "../src/entities/address";
import { Gender } from "../src/entities/gender";
import { RequestUser } from "../src/entities/request/RequestUser";
import { ImmigrationOfficerRepository } from "../src/repositories/immigration_officer_repository";
import { sampleSymptoms } from "./seed_data/sample_symptoms";

export async function seedDb(seedVal = 1): Promise<void> {
    const pool = new Pool();
    const userRepository = new UserRepository(pool);
    const doctorRepository = new DoctorRepository(pool, userRepository);
    const patientRepository = new PatientRepository(pool, userRepository);
    const adminRepository = new AdminRepository(pool, userRepository);
    const statusRepository = new StatusRepository(pool);
    const healthOfficialRepository = new HealthOfficialRepository(pool, userRepository);
    const immigrationOfficerRepository = new ImmigrationOfficerRepository(pool, userRepository);

    faker.setLocale("en_CA");

    // insert addresses
    const numAddresses = [1, seedVal + 1];
    for (let i = numAddresses[0]; i < numAddresses[1]; i++) {
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

        await userRepository.addAddress(address);
    }

    // 5 patients per address
    const numPatients = [1, 5 * (numAddresses[1] - 1) + 1];
    // 20 patients per doctor
    const numDoctors = [numPatients[1], numPatients[1] + Math.ceil((numPatients[1] - 1) / 20)];
    const numAdmins = [numDoctors[1], numDoctors[1] + 1];
    const numHealthOfficials = [numAdmins[1], numAdmins[1] + 1];
    const numImmigrationOfficers = [numHealthOfficials[1], numHealthOfficials[1] + 1];

    // insert users
    const numUsers = numImmigrationOfficers[1];
    for (let i = 1; i < numUsers; i++) {
        const rawGender = faker.name.gender(true);
        const firstName = faker.name.firstName(rawGender);
        const lastName = faker.name.lastName(rawGender);
        let email = faker.internet.email(firstName, lastName);
        if (i === numDoctors[0]) {
            email = "doctor@test.com";
        }
        if (i === numAdmins[0]) {
            email = "admin@test.com";
        }
        if (i === numHealthOfficials[0]) {
            email = "health_official@test.com";
        }
        if (i === numImmigrationOfficers[0]) {
            email = "immigration_officer@test.com";
        }

        const user: RequestUser = {
            email,
            password: await bcrypt.hash("Test123!", 10),
            firstName,
            lastName,
            phoneNumber: faker.phone.phoneNumber(),
            gender: rawGender === "Male" ? Gender.MALE : Gender.FEMALE,
            dateOfBirth: faker.date.between("1920-01-01T00:00:00.000Z", "2000-01-01T00:00:00.000Z"),
        };
        const addressId = faker.datatype.number({ min: numAddresses[0], max: numAddresses[1] - 1 });

        await userRepository.addUser(user, addressId);
    }

    // assign roles
    for (let i = numPatients[0]; i < numPatients[1]; i++) {
        await patientRepository.addPatient(i);
    }
    for (let i = numDoctors[0]; i < numDoctors[1]; i++) {
        await doctorRepository.addDoctor(i);
    }
    for (let i = numAdmins[0]; i < numAdmins[1]; i++) {
        await adminRepository.addAdmin(i);
    }
    for (let i = numHealthOfficials[0]; i < numHealthOfficials[1]; i++) {
        await healthOfficialRepository.addHealthOfficial(i);
    }
    for (let i = numImmigrationOfficers[0]; i < numImmigrationOfficers[1]; i++) {
        await immigrationOfficerRepository.addImmigrationOfficer(i);
    }

    // assign doctors to patients
    for (let i = numPatients[0]; i < numPatients[1]; i++) {
        const doctorId = faker.datatype.number({ min: numDoctors[0], max: numDoctors[1] - 1 });
        await patientRepository.updateAssignedDoctor(i, doctorId);
    }

    // assign status fields
    for (let i = numPatients[0]; i < numPatients[1]; i++) {
        const fields = {
            temperature: true,
            weight: true,
            fever: faker.datatype.boolean(),
            cough: faker.datatype.boolean(),
            shortnessOfBreath: faker.datatype.boolean(),
            lossOfTasteAndSmell: faker.datatype.boolean(),
            nausea: faker.datatype.boolean(),
            stomachAches: faker.datatype.boolean(),
            vomiting: faker.datatype.boolean(),
            headache: faker.datatype.boolean(),
            musclePain: faker.datatype.boolean(),
            soreThroat: faker.datatype.boolean(),
            otherSymptoms: true,
        };
        await statusRepository.updateStatusFields(i, fields);

        // add status reports
        const numStatusesPerPatient = 10;
        for (let j = 0; j < numStatusesPerPatient; j++) {
            const status = Object.keys(fields)
                .filter((key) => fields[key])
                .reduce((obj, key) => {
                    obj[key] = faker.datatype.boolean();
                    return obj;
                }, {});

            await statusRepository.insertStatus(i, {
                ...status,
                weight: faker.datatype.number({ min: 120, max: 200, precision: 0.1 }),
                temperature: faker.datatype.number({ min: 35, max: 41, precision: 0.1 }),
                otherSymptoms: sampleSymptoms[faker.datatype.number({ min: 0, max: sampleSymptoms.length - 1 })],
            });
        }
    }

    await pool.end();
}
