const multer = require("multer");
const path = require("path");
const fs = require("fs");

const dossierUpload = path.join(__dirname, "../../uploads/produits");

if (!fs.existsSync(dossierUpload)) {
  fs.mkdirSync(dossierUpload, { recursive: true });
}

const stockage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dossierUpload);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const nomFichier = `produit-${Date.now()}${extension}`;
    cb(null, nomFichier);
  },
});

const filtreFichier = (req, file, cb) => {
  const typesAutorises = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

  if (typesAutorises.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Seules les images JPG, PNG et WEBP sont autorisées"), false);
  }
};

const uploadProduit = multer({
  storage: stockage,
  fileFilter: filtreFichier,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = uploadProduit;