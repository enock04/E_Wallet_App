import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'user@example.com',
    pass: process.env.EMAIL_PASS || 'password',
  },
});

export async function sendEmailOtp(toEmail: string, otpCode: string): Promise<void> {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"E-Wallet" <no-reply@ewallet.com>',
    to: toEmail,
    subject: 'Your OTP Code for Verification',
    text: `Your OTP code is: ${otpCode}. It expires in 5 minutes.`,
    html: `<p>Your OTP code is: <strong>${otpCode}</strong>. It expires in 5 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
}
