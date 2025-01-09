const nodemailer = require('nodemailer');

// Create a transporter object
let transporter = nodemailer.createTransport({
  host: 'smtppro.zoho.in', // replace with your SMTP server
  port: 465, // 465 for SSL or 587 for TLS
  secure: true, // true for SSL, false for TLS
  auth: {
    user: 'anish@outdidtech.com', // your email
    pass: '5XuiNJvgeijM', // your email password
  },
});

// Function to send email
async function sendEmail(to, subject, text) {
  try {
    // Define email options
    let info = await transporter.sendMail({
      from: '"ECOMM WEBSITE" <anish@outdidtech.com>', // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: `<p>${text}</p>`, // HTML body (simplified)
    });

    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

async function EmailConfig(email, otp) {
  try {
    let sendTo = email;
    let mail_subject = 'ECOMM WEBSITE - FORGET PASSWORD OTP';
    let mail_body = `
      Hello ${email},<br><br>
      We received a request to reset your password. Please use the following One-Time Password (OTP) to proceed with the password reset process:<br><br>
      Your OTP is: <strong>${otp}</strong><br><br>
      Thank you,<br>ECOMM WEBSITE
    `;
    
    const result = await sendEmail(sendTo, mail_subject, mail_body);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

module.exports = { EmailConfig };
