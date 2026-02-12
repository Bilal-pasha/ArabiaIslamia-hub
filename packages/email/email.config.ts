// libs/email/email.config.ts

export interface EmailConfig {
    host: string;       // SMTP host
    port: number;       // SMTP port
    secure: boolean;    // true for 465, false for 587
    user: string;       // SMTP username
    pass: string;       // SMTP password
    fromName?: string;  // optional "display name"
    fromEmail: string;  // default sending address
}

// Example default config for AWS SES SMTP
export const defaultEmailConfig: EmailConfig = {
    host: process.env.SMTP_HOST ?? '',
    port: Number(process.env.SMTP_PORT) ?? 587,
    secure: false,
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASS ?? "",
    fromName: process.env.SMTP_FROM_NAME ?? "",
    fromEmail: process.env.SMTP_FROM ?? "",
};
