import "reflect-metadata";
import { inject, injectable } from "inversify";
import * as twilio from "twilio";
import { SMSMessage } from "../entities/sms_message";
import { EmailMessage } from "../entities/email_message";
import { Transporter } from "nodemailer";
import * as SMTPTransport from "nodemailer/lib/smtp-transport";

@injectable()
export class NotificationGateway {
    constructor(
        @inject("TwilioClient") private readonly twilioClient: twilio.Twilio,
        @inject("NodemailerTransporter")
        private readonly nodemailerTransporter: Transporter<SMTPTransport.SentMessageInfo>,
    ) {}

    async sendSMS(smsMessage: SMSMessage): Promise<void> {
        await this.twilioClient.messages.create({
            body: smsMessage.body,
            messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
            to: smsMessage.to || process.env.TWILIO_DEFAULT_TO,
        });
    }

    async sendEmail(emailMessage: EmailMessage): Promise<void> {
        console.log(emailMessage);
        await this.nodemailerTransporter.sendMail(emailMessage);
    }
}
