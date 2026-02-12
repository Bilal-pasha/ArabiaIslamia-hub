// libs/email/email.service.ts
import nodemailer from "nodemailer";
import { EmailConfig } from "./email.config";

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor(private config: EmailConfig) {
        this.transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: {
                user: config.user,
                pass: config.pass,
            },
        });
    }

    async sendMail(options: {
        to: string | string[];
        subject: string;
        text?: string;
        html?: string;
        fromEmail?: string;
        fromName?: string;
    }) {
        const from = options.fromEmail || this.config.fromEmail;
        const fromName = options.fromName || this.config.fromName;
        const fromHeader = fromName ? `"${fromName}" <${from}>` : from;

        return this.transporter.sendMail({
            from: fromHeader,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        });
    }
}
