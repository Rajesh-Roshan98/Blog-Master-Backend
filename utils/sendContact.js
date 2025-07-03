const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendContactEmail = async (senderName, senderEmail, senderMessage) => {
  const htmlContent = `
  <div style="max-width:600px;margin:auto;padding:24px;background:linear-gradient(135deg, #f9f9f9, #ffffff);border-radius:12px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;color:#333;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
    <h2 style="color:#0a66c2;text-align:center;margin-bottom:20px;">📬 New Contact Us Submission</h2>

    <div style="font-size:15px;margin-bottom:18px;line-height:1.6;">
      <p><strong>👤 Name:</strong> ${senderName}</p>
      <p><strong>📧 Email:</strong> ${senderEmail}</p>
    </div>

    <div style="padding:15px;background-color:#f5f8fa;border-radius:8px;border:1px solid #ccc;margin-bottom:24px;font-size:14px;color:#222;line-height:1.5;">
      <strong>💬 Message:</strong><br>
      <div style="margin-top:8px;white-space:pre-line;">${senderMessage}</div>
    </div>

    <hr style="border:none;border-top:1px solid #ddd;margin:20px 0;" />

    <p style="font-size:12px;text-align:center;color:#888;">
      🔔 This message was sent from your <strong>BlogMaster</strong> Contact Us form.<br>
      If you did not expect this, you can safely ignore it.
    </p>
  </div>
  `;

  const mailOptions = {
    from: `"BlogMaster Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_RECEIVER,
    subject: '📩 New Contact Us Message',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Contact Us email sent successfully!');
  } catch (error) {
    console.error('Error sending Contact Us email:', error);
    throw new Error('Error sending Contact Us email.');
  }
};

module.exports = sendContactEmail;
