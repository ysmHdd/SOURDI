const nodemailer = require("nodemailer");

const envoyerEmailIdentifiants = async (to, email, password) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Vos identifiants SOURDI",
    html: `
      <h2>Bienvenue sur SOURDI</h2>
      <p>Votre compte a été mis à jour.</p>
      <p><b>Email :</b> ${email}</p>
      <p><b>Mot de passe :</b> ${password}</p>
      <p>Veuillez vous connecter et changer votre mot de passe.</p>
    `,
  });
};

module.exports = { envoyerEmailIdentifiants };