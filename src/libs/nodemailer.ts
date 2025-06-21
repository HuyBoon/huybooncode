import nodemailer from "nodemailer";

interface EmailData {
    to: string;
    subject: string;
    text: string;
    html: string;
}

export async function sendEmail({ to, subject, text, html }: EmailData) {
    try {
        // Create Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.USER_MAIL,
                pass: process.env.USER_PASSWORD,
            },
        });

        // Email options
        const mailOptions = {
            from: process.env.USER_MAIL,
            to,
            subject,
            text,
            html,
        };

        // Send email
        await transporter.sendMail(mailOptions);
        return { success: true, message: "Email sent successfully!" };
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email.");
    }
}