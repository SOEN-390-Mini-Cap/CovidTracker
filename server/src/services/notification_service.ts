import "reflect-metadata";
import { inject, injectable, named } from "inversify";
import { NotificationGateway } from "../gateways/notification_gateway";
import { UserRepository } from "../repositories/user_repository";

@injectable()
export class NotificationService {
    constructor(
        @inject("Gateway")
        @named("SMSGateway")
        private readonly smsGateway: NotificationGateway,
        @inject("Repository")
        @named("UserRepository")
        private readonly userRepository: UserRepository,
    ) {}

    async sendSMS(userId: number, body: string): Promise<void> {
        // Removed for now due to trial Twilio account, all messages will be routed to
        // the default phone number stored in process.env.TWILIO_DEFAULT_TO
        // const { phoneNumber } = await this.userRepository.findUserByUserId(userId);

        this.smsGateway.sendSMS({
            to: null,
            body,
        });
    }

    async sendEmail(userId: number, subject: string, body: string): Promise<void> {
        const user = await this.userRepository.findUserByUserId(userId);

        this.smsGateway.sendEmail({
            from: process.env.NODEMAILER_USERNAME,
            to: user.account.email,
            subject,
            body,
        });
    }
}
