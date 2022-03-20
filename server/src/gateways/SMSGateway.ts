import "reflect-metadata";
import { inject, injectable } from "inversify";
import * as twilio from "twilio";
import { SMSMessage } from "../entities/SMSMessage";

@injectable()
export class SMSGateway {
    constructor(@inject("TwilioClient") private readonly twilioClient: twilio.Twilio) {}

    async sendSMS(smsMessage: SMSMessage): Promise<void> {
        await this.twilioClient.messages.create({
            body: smsMessage.body,
            messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID || "",
            to: smsMessage.to || process.env.TWILIO_DEFAULT_TO,
        });
    }
}
