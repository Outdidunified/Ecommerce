const nodemailer = require('nodemailer');

// Create a transporter object with SMTP details
const transporter = nodemailer.createTransport({
  host: 'smtppro.zoho.in', // SMTP server address
  port: 465, // Use 465 for SSL, 587 for TLS
  secure: true, // Use SSL (true) or TLS (false)
  auth: {
    user: 'anish@outdidtech.com', // Your email address
    pass: '5XuiNJvgeijM', // Your email password
  },
});

// Function to send an email
async function sendEmail(to, subject, text, html) {
  try {
    // Define the email options and send the email
    const info = await transporter.sendMail({
      from: '"ECOMM WEBSITE" <anish@outdidtech.com>', // Sender's address
      to: to, // Recipient's address
      subject: subject, // Subject line
      text: text, // Plain text body
      html: html, // HTML body
    });

    console.log('Message sent: %s', info.messageId); // Log the message ID
    return true;
  } catch (error) {
    console.error('Error sending email:', error); // Log any error
    return false;
  }
}

// Function to configure and send the OTP email
async function EmailConfig(email, otp) {
  try {
    const subject = 'ECOMM WEBSITE - FORGET PASSWORD OTP'; // Subject of the email
    const text = `Hello ${email},\n\nWe received a request to reset your password. Please use the following One-Time Password (OTP):\n\n${otp}\n\nIf you did not request a password reset, please ignore this email.`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; background-color: #f9f9f9;">
        <h2 style="text-align: center; color: #333;">ECOMM WEBSITE</h2>
        <p style="color: #555; line-height: 1.5; font-size: 16px;">
          Hello <strong>${email}</strong>,<br><br>
          We received a request to reset your password. Please use the following One-Time Password (OTP) to proceed with the password reset process:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 20px; font-weight: bold; color: #007BFF; padding: 10px 20px; border: 1px dashed #007BFF; border-radius: 5px; display: inline-block;">
            ${otp}
          </span>
        </div>
        <p style="color: #555; line-height: 1.5; font-size: 16px;">
          If you did not request a password reset, please ignore this email or contact our support team.
        </p>
        <p style="color: #555; font-size: 14px; text-align: center; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
          Thank you,<br>
          <strong>ECOMM WEBSITE</strong><br>
          <a href="https://ecommwebsite.com" style="color: #007BFF; text-decoration: none;">Visit Our Website</a>
        </p>
      </div>
    `;

    // Call the sendEmail function to send the OTP email
    const result = await sendEmail(email, subject, text, html);
    return result;
  } catch (error) {
    console.error('Error in EmailConfig:', error); // Log any errors that occur
    return false;
  }
}

module.exports = { EmailConfig };
