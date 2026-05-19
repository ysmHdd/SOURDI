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
      <div style="
        margin:0;
        padding:40px 20px;
        background:#0b0718;
        font-family:Arial,sans-serif;
      ">
        <div style="
          max-width:600px;
          margin:auto;
          background:linear-gradient(180deg,#1b1236,#120d25);
          border:1px solid rgba(124,77,255,0.25);
          border-radius:28px;
          overflow:hidden;
          box-shadow:0 20px 50px rgba(0,0,0,0.45);
        ">
          
          <div style="
            padding:30px;
            text-align:center;
            border-bottom:1px solid rgba(255,255,255,0.08);
          ">
            <h1 style="
              margin:0;
              font-size:42px;
              color:#b84dff;
              font-weight:900;
              letter-spacing:1px;
            ">
              SOURDI
            </h1>

            <p style="
              margin-top:10px;
              color:#9f96c7;
              font-size:15px;
              font-weight:600;
            ">
              Plateforme éducative interactive
            </p>
          </div>

          <div style="padding:45px 35px;">
            <h2 style="
              margin-top:0;
              color:white;
              font-size:28px;
              font-weight:800;
              text-align:center;
            ">
              Confirmez votre adresse email
            </h2>

            <p style="
              color:#c8c3e0;
              font-size:16px;
              line-height:1.7;
              text-align:center;
              margin-top:18px;
            ">
              Merci de rejoindre SOURDI.
              Cliquez sur le bouton ci-dessous pour activer votre compte.
            </p>

            <div style="text-align:center; margin-top:38px;">
              <a href="${lien}" style="
                display:inline-block;
                padding:16px 34px;
                border-radius:16px;
                text-decoration:none;
                background:linear-gradient(135deg,#7C4DFF,#E040FB);
                color:white;
                font-size:16px;
                font-weight:800;
                box-shadow:0 10px 25px rgba(124,77,255,0.35);
              ">
                Confirmer mon compte
              </a>
            </div>

            <div style="
              margin-top:40px;
              padding:18px;
              border-radius:16px;
              background:rgba(255,255,255,0.04);
              border:1px solid rgba(255,255,255,0.06);
            ">
              <p style="
                margin:0;
                color:#a89fcf;
                font-size:14px;
                line-height:1.6;
                text-align:center;
              ">
                Ce lien de confirmation expire dans 1 heure.
              </p>
            </div>
          </div>

          <div style="
            padding:22px;
            text-align:center;
            border-top:1px solid rgba(255,255,255,0.08);
            color:#7f78a8;
            font-size:13px;
          ">
            © 2025 SOURDI — Tous droits réservés
          </div>
        </div>
      </div>
    `,
  });
};

module.exports = {
  envoyerEmailConfirmation,
};