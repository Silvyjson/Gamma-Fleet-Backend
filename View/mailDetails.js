const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

logo_url =
  "https://res.cloudinary.com/do2ejotmr/image/upload/v1721391455/gammafleet1_sbdnnn.png";

const VerificationMail = (clientName, verificationLink) => {
  return `
  <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3>Welcome ${clientName}</h3>
        <p>Thank you for registering with us. Please verify your email address by clicking on the link below.</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>If you did not register with us, please ignore this email.</p>
        <p>Best regards</p>
        <p>The GammaFleet Team</p>
        <img src=${logo_url} alt="gamma fleet logo" width= "80px" style="margin: 20px 0"/>
    </div>
  </body>`;
};

const InvitationMail = (fullName, clientName, email, password, inviteLink) => {
  return `
  <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p>Hello <strong>${fullName}</strong>,</p>
        <p>You have been invited to join <strong>${clientName}</strong>.</p>
        <p>Please click the link below to sign in with your login details:</p>
        <p>Email: <strong>${email}</strong><br>
        Password: <strong>${password}</strong></p>
        <p><a href="${inviteLink}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Sign In</a></p>
        <img src=${logo_url} alt="gamma fleet logo" width= "80px" style="background-color: red; margin: 10px 0"/>
    </div>
  </body>`;
};

const ResetPasswordMail = (lastName, firstName, ResetLink) => {
  return `
  <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h1>Reset Password</h1>
      <h3>Hello ${lastName} ${firstName}</h3>
      <p>Click on the link below to reset your password</p>
      <a href="${ResetLink}">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
      <p>Thanks</p>
    </div>
  </body>`;
};

module.exports = {
  VerificationMail,
  InvitationMail,
  ResetPasswordMail,
};
