const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const logo_url =
  "https://res.cloudinary.com/do2ejotmr/image/upload/v1722242637/Screenshot_2024-07-29_094312_tyiuje.png";

const loadTemplate = (templateName, variables) => {
  const templatePath = path.join(__dirname, `Email/${templateName}.html`);
  const template = fs.readFileSync(templatePath, "utf-8");
  const compiledTemplate = handlebars.compile(template);
  return compiledTemplate(variables);
};

const VerificationMail = (clientName, OTP) => {
  return loadTemplate("verificationMail", { clientName, OTP, logo_url });
};

const InvitationMail = (fullName, clientName, email, password, inviteLink) => {
  return loadTemplate("invitationMail", {
    fullName,
    clientName,
    email,
    password,
    inviteLink,
    logo_url,
  });
};

const ResetPasswordMail = (lastName, firstName, ResetLink) => {
  return loadTemplate("resetPasswordMail", {
    lastName,
    firstName,
    ResetLink,
    logo_url,
  });
};

module.exports = {
  VerificationMail,
  InvitationMail,
  ResetPasswordMail,
};
