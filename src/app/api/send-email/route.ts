import { NextResponse } from "next/server";
import { sendEmail } from "@/libs/nodemailer";
import { getEmailTemplate } from "@/libs/emailTemplate";

export async function POST(request: Request) {
    try {
        const { name, email, message } = await request.json();

        // Validate input
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "All fields are required." },
                { status: 400 }
            );
        }

        // Get email template
        const { text, html } = getEmailTemplate({ name, email, message });

        // Send email
        await sendEmail({
            to: process.env.USER_MAIL!,
            subject: `New Contact Form Submission from ${name}`,
            text,
            html,
        });

        return NextResponse.json(
            { message: "Email sent successfully!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in API route:", error);
        return NextResponse.json(
            { error: "Failed to send email." },
            { status: 500 }
        );
    }
}