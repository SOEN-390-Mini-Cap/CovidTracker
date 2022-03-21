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
import { User } from "../entities/user";
import { AuthorizationError } from "../entities/errors/authorization_error";

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

        const password = await bcrypt.hash(userData.password, 10);
        const userId = await this.userRepository.addUser({
            firstName: userData.firstName,
            lastName: userData.lastName,
            phoneNumber: userData.phoneNumber,
            gender: userData.gender,
            dateOfBirth: userData.dateOfBirth,
            isPrioritized: false,
            role: null,
            address: {
                addressId,
                streetAddress: null,
                streetAddressLineTwo: null,
                city: null,
                postalCode: null,
                province: null,
                country: null,
            },
            account: {
                userId: null,
                email: userData.email,
                password,
                createdOn: new Date(),
            },
        });

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

    async whoami(token: Token): Promise<User> {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            return this.userRepository.findUserByUserId(+payload["userId"]);
        } catch (error) {
            throw new AuthorizationError();
        }
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
