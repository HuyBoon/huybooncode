interface FormData {
    name: string;
    email: string;
    message: string;
}

export function getEmailTemplate({ name, email, message }: FormData) {
    const submittedAt = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour12: true,
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    const text = `
    Name: ${name}
    Email: ${email}
    Message: ${message}
    Submitted At: ${submittedAt}
  `;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #333;">New Contact Form HuyBoonCode Submission</h2>
      <p style="color: #555;"><strong>Name:</strong> ${name}</p>
      <p style="color: #555;"><strong>Email:</strong> ${email}</p>
      <p style="color: #555;"><strong>Message:</strong> ${message}</p>
      <p style="color: #555;"><strong>Submitted At:</strong> ${submittedAt}</p>
      <hr style="border-top: 1px solid #e0e0e0; margin: 20px 0;">
      <p style="color: #888; font-size: 12px;">This email was sent from your website's contact form.</p>
    </div>
  `;

    return { text, html };
}