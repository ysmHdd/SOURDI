const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const envoyerEmailConfirmation = async (email, token) => {
  const lien = `${process.env.BACKEND_URL}/api/auth/confirmer-email/${token}`;

  await transporter.sendMail({
    from: `"SOURDI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Confirmation de votre compte SOURDI",
    html: `
      <h2>Bienvenue sur SOURDI</h2>
      <p>Veuillez confirmer votre adresse email.</p>
      <a href="${lien}">Confirmer mon compte</a>
      <p>Ce lien expire dans 1 heure.</p>
    `,
  });
};

module.exports = {
  envoyerEmailConfirmation,
};