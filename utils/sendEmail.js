const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendVerificationEmail = async (recipientEmail, verificationCode) => {
    const htmlContent = `
  <div style="max-width:600px;margin:auto;padding:40px;background:linear-gradient(to right,#f0f4f8,#ffffff);border-radius:12px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;color:#333;box-shadow:0 4px 12px rgba(0,0,0,0.15);">
    <div style="text-align:center;">
      <img src="https://cdn-icons-png.flaticon.com/512/2950/2950669.png" alt="Shield Icon" width="80" style="margin-bottom:20px;" />
      <h2 style="color:#0a66c2;margin-bottom:10px;">Email Verification</h2>
      <p style="font-size:16px;">Hi there 👋,</p>
      <p style="font-size:15px;margin-top:10px;">To continue using <strong>BlogMaster</strong>, please use the verification code below:</p>
    </div>

    <div style="margin:30px 0;text-align:center;">
      <span style="display:inline-block;padding:15px 30px;background-color:#0a66c2;color:#fff;font-size:28px;font-weight:bold;letter-spacing:6px;border-radius:8px;">
        ${verificationCode}
      </span>
    </div>

    <p style="text-align:center;font-size:14px;color:#555;">
      🔒 This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.
    </p>

    <hr style="margin:40px 0;border:none;border-top:1px solid #ccc;" />

    <p style="font-size:13px;text-align:center;color:#999;">
      Didn't request this email? You can safely ignore it.<br>
      © 2025 BlogMaster. All rights reserved.
    </p>
  </div>
`;


    const mailOptions = {
        from: process.env.EMAIL,
        to: recipientEmail,
        subject: 'Your Verification Code',
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Error sending verification email.');
    }
};

module.exports = sendVerificationEmail;
