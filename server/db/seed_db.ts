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

export async function seedDb(): Promise<void> {
    const pool = new Pool();
    const userRepository = new UserRepository(pool);
    const doctorRepository = new DoctorRepository(pool, userRepository);
    const patientRepository = new PatientRepository(pool, userRepository);
    const adminRepository = new AdminRepository(pool, userRepository);
    const statusRepository = new StatusRepository(pool);

    // add addresses
    for (const address of addresses) {
        await userRepository.addAddress(address);
    }

    // add users
    for (const { userData, addressId } of users) {
        await userRepository.addUser(
            {
                ...userData,
                password: await bcrypt.hash(userData.password, 10)
            },
            addressId,
        );
    }

    // add doctors
    await doctorRepository.addDoctor(1);
    await doctorRepository.addDoctor(2);

    // add patients
    await patientRepository.addPatient(3);
    await patientRepository.addPatient(4);
    await patientRepository.addPatient(5);

    await statusRepository.updatePatientStatusFields(5, { weight: true, temperature: true, otherSymptoms: true });

    // add admin
    await adminRepository.addAdmin(6);

    // assign patient to doctor
    await patientRepository.updateAssignedDoctor(4, 1);
    await patientRepository.updateAssignedDoctor(5, 2);

    await pool.end();
}
