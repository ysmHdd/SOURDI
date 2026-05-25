const http = require("http");
const Calendrier = require("../models/Calendrier");

const envoyerNotification = (data) => {
  try {
    const body = JSON.stringify(data);

    const req = http.request(
      {
        hostname: "localhost",
        port: 5009,
        path: "/api/notifications/interne",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
        timeout: 2000,
      },
      (res) => {
        res.on("data", () => {});
      }
    );

    req.on("error", () => {});
    req.on("timeout", () => req.destroy());

    req.write(body);
    req.end();
  } catch {}
};

const verifierSeances = async () => {
  try {
    const maintenant = new Date();

    const dateAujourdhui = maintenant.toISOString().split("T")[0];

    const heure = String(maintenant.getHours()).padStart(2, "0");
    const minute = String(maintenant.getMinutes()).padStart(2, "0");
    const heureActuelle = `${heure}:${minute}`;

    const seances = await Calendrier.find({
      date: dateAujourdhui,
      heureDebut: heureActuelle,
    });

    seances.forEach((seance) => {
      envoyerNotification({
        utilisateurId: seance.utilisateurId,
        role: "etudiant",
        titre: "C'est l'heure de votre séance",
        message: `Votre séance ${seance.matiere} commence maintenant.`,
        type: "calendrier",
        lien: "/eleve/calendrier",
        referenceId: `rappel-${seance._id}-${dateAujourdhui}-${heureActuelle}`,
      });
    });
  } catch (erreur) {
    console.error("Erreur rappel calendrier :", erreur.message);
  }
};

const demarrerRappelSeances = () => {
  setInterval(verifierSeances, 60 * 1000);
  verifierSeances();
};

module.exports = demarrerRappelSeances;