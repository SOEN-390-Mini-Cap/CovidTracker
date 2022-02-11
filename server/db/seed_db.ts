import "dotenv/config";
import { Pool } from "pg";
import { users } from "./seed_data/user_data";
import * as bcrypt from "bcrypt";
import { addresses } from "./seed_data/address_data";
import { UserRepository } from "../src/repositories/user_repository";
import { DoctorRepository } from "../src/repositories/doctor_repository";
import { PatientRepository } from "../src/repositories/patient_repository";

(async () => {
    const pool = new Pool();
    const userRepository = new UserRepository(pool);

    // add addresses
    await Promise.all(
        addresses.map(async (address) => {
            await userRepository.addAddress(address);
        }),
    );

    console.log("Finished seeding addresses");

    // add users
    await Promise.all(
        users.map(async ({ userData, addressId }) => {
            userData.password = await bcrypt.hash(userData.password, 10);
            await userRepository.addUser(userData, addressId);
        }),
    );

    const doctorRepository = new DoctorRepository(pool, userRepository);
    const patientRepository = new PatientRepository(pool, userRepository);
    // Make user doctor
    await doctorRepository.addDoctor(1);
    // Make user patient
    await patientRepository.addPatient(2);
    // assign patient to doctor
    await patientRepository.updateAssignedDoctor(2, 1);
    console.log("Finished seeding users");

    await pool.end();

    console.log("Finished seeding database...");
})();
