import "reflect-metadata";
import { inject, injectable } from "inversify";
import * as twilio from "twilio";
import { SMS } from "../entities/sms";
import { Email } from "../entities/email";
import { Transporter } from "nodemailer";
import * as SMTPTransport from "nodemailer/lib/smtp-transport";

@injectable()
export class NotificationGateway {
    constructor(
        @inject("TwilioClient") private readonly twilioClient: twilio.Twilio,
        @inject("NodemailerTransporter")
        private readonly nodemailerTransporter: Transporter<SMTPTransport.SentMessageInfo>,
    ) {}

    async sendSMS(sms: SMS): Promise<void> {
        await this.twilioClient.messages.create({
            body: sms.body,
            to: sms.to,
            messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
        });
    }

    async sendEmail(email: Email): Promise<void> {
        await this.nodemailerTransporter.sendMail(email);
    }
}
