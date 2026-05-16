const multer = require("multer");
const path = require("path");
const fs = require("fs");

const dossierUpload = path.join(__dirname, "../../uploads/messages");

if (!fs.existsSync(dossierUpload)) {
  fs.mkdirSync(dossierUpload, { recursive: true });
}

const stockage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dossierUpload);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const nomFichier = `message-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${extension}`;

    cb(null, nomFichier);
  },
});

const filtreFichier = (req, file, cb) => {
  const typesAutorises = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
  ];

  if (typesAutorises.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Type de fichier non autorisé"), false);
  }
};

const uploadMessage = multer({
  storage: stockage,
  fileFilter: filtreFichier,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = uploadMessage;