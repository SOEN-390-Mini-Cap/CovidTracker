import "dotenv/config";
import { Pool } from "pg";
import { users } from "./seed_data/user_data";
import * as bcrypt from "bcrypt";
import { addresses } from "./seed_data/address_data";
import { UserRepository } from "../src/repositories/user_repository";
import { DoctorRepository } from "../src/repositories/doctor_repository";
import { PatientRepository } from "../src/repositories/patient_repository";
import { AdminRepository } from "../src/repositories/admin_repository";

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
    const adminRepository = new AdminRepository(pool, userRepository);

    // Make user doctor
    await doctorRepository.addDoctor(1);
    await doctorRepository.addDoctor(2);

    // Make user patient
    await patientRepository.addPatient(3);
    await patientRepository.addPatient(4);
    await patientRepository.addPatient(5);

    // assign patient to doctor
    await patientRepository.updateAssignedDoctor(3, 1);
    await patientRepository.updateAssignedDoctor(4, 1);
    await patientRepository.updateAssignedDoctor(5, 2);

    await adminRepository.addAdmin(6);

    console.log("Finished seeding users");

    await pool.end();

    console.log("Finished seeding database...");
})();
