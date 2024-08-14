const nodemailer = require("nodemailer");

const AUTH_EMAIL = process.env.EMAIL;
const AUTH_PASSWORD = process.env.PASSWORD;

const SendEmail = async (email, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: AUTH_EMAIL,
      pass: AUTH_PASSWORD,
    },
  });

  const mailDetails = {
    from: `"Gamma Fleet" <${AUTH_EMAIL}>`,
    to: email,
    subject: subject,
    html: message,
  };

  await transporter.sendMail(mailDetails);
};

module.exports = SendEmail;
