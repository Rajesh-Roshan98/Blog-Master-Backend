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
    <div style="max-width:600px;margin:auto;padding:24px;background:#f9f9f9;border-radius:12px;">
      <h2 style="color:#0a66c2;text-align:center;">📬 New Contact Us Submission</h2>
      <p><strong>👤 Name:</strong> ${senderName}</p>
      <p><strong>📧 Email:</strong> ${senderEmail}</p>
      <div style="margin-top:12px;padding:12px;border:1px solid #ccc;border-radius:8px;">
        <strong>💬 Message:</strong><br />
        <pre style="white-space:pre-wrap;">${senderMessage}</pre>
      </div>
      <hr style="border:none;border-top:1px solid #ddd;margin:20px 0;" />
      <p style="font-size:12px;text-align:center;color:#888;">
        🔔 This message was sent from your <strong>BlogMaster</strong> Contact Us form.<br>
        If you did not expect this, you can safely ignore it.
      </p>
    </div>`;

  const mailOptions = {
    from: `"BlogMaster Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_RECEIVER,
    subject: '📩 New Contact Us Message',
    html: htmlContent,
  };

  try {
    await transporter.verify();
    await transporter.sendMail(mailOptions);
    console.log('✅ Contact Us email sent successfully!');
  } catch (error) {
    console.error('❌ Error sending Contact Us email:', error);
    throw new Error('Failed to send contact email. ' + error.message);
  }
};

module.exports = sendContactEmail;
