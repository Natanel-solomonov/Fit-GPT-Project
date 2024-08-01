import nodemailer from 'nodemailer';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use app-specific password if 2FA is enabled
  },
});

// Define the sendThankYouEmail function
export const sendThankYouEmail = async (email, name) => {
  console.log('Preparing to send email to:', email);

  // Define the mail options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to FitGPT!',
    html: `
      <p>Hi ${name},</p>
      <p>Congratulations on joining FitGPT! We're excited to have you on board, and can't wait to help you on your fitness journey.</p>
      <p>Best regards,<br>The FitGPT Team</p>
      <br>
      <div style="text-align: center;">
        <img src="cid:emaillogo" style="width: 50%;" />
      </div>
    `,
    attachments: [
      {
        filename: 'EmailLogo.png',
        path: path.resolve(__dirname, '../../../frontend/public/EmailLogo.png'), // Correct the path here
        cid: 'emaillogo' // same cid value as in the html img src
      }
    ]
  };

  console.log('Mail options prepared:', mailOptions);

  // Try to send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (error) {
    console.error('Error sending thank you email:', error);
    throw new Error('Failed to send thank you email');
  }
};