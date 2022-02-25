import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { UserRepository } from "../repositories/user_repository";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Token } from "../entities/token";
import { RequestUser } from "../entities/request/RequestUser";
import { RequestAddress } from "../entities/request/RequestAddress";
import { AuthenticationError } from "../entities/errors/authentication_error";
import { PatientRepository } from "../repositories/patient_repository";

@injectable()
export class AuthenticationService {
    constructor(
        @inject("Repository")
        @named("UserRepository")
        private readonly userRepository: UserRepository,
        @inject("Repository")
        @named("PatientRepository")
        private readonly patientRepository: PatientRepository,
    ) {}

    async signUp(userData: RequestUser, addressData: RequestAddress): Promise<Token> {
        const addressId = await this.userRepository.addAddress(addressData);

        userData.password = await bcrypt.hash(userData.password, 10);
        const userId = await this.userRepository.addUser(userData, addressId);

        return this.signToken(userId);
    }

    async signIn(email: string, password: string): Promise<Token> {
        const user = await this.userRepository.findUserByEmail(email);
        if (!user) {
            throw new AuthenticationError();
        }

        const isMatch = await bcrypt.compare(password, user.account.password);
        if (!isMatch) {
            throw new AuthenticationError();
        }

        return this.signToken(user.account.userId);
    }

    private async signToken(userId: number): Promise<Token> {
        return jwt.sign(
            {
                userId,
            },
            process.env.JWT_SECRET,
        );
    }

    async isUserPatientOfDoctor(patientId: number, doctorId: number): Promise<boolean> {
        const assignedDoctorId = await this.patientRepository.findAssignedDoctorId(patientId);
        return assignedDoctorId === doctorId;
    }
}
