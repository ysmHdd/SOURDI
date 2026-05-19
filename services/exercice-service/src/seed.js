const path = require("path");
// 🔥 On force dotenv à lire le fichier .env situé à la racine du microservice
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const connecterDB = require("./configuration/baseDeDonnees");

// Définition du Schéma de l'exercice
const ExerciceSchema = new mongoose.Schema({
  titre: String,
  description: String,
  matiere: String,
  niveau: Number,
  sousCat: String,
  difficulte: String,
  question: String,
  options: [String],
  reponseCorrecte: Number
}, { collection: 'exercices' });

const Exercice = mongoose.models.Exercice || mongoose.model("Exercice", ExerciceSchema);

const baseExercices = [
  // MATIÈRE : FRANÇAIS
  {
    titre: "Le Présent de l'Indicatif",
    description: "Quiz sur la conjugaison des verbes au présent.",
    matiere: "francais",
    sousCat: "Grammaire & Conjugaison",
    difficulte: "facile",
    question: "Choisissez la bonne forme : 'Les élèves _______ (finir) leurs devoirs.'",
    options: ["finissent", "finis", "finissez", "finirent"],
    reponseCorrecte: 0
  },
  {
    titre: "Les Synonymes",
    description: "Trouve le mot qui a le même sens.",
    matiere: "francais",
    sousCat: "Vocabulaire",
    difficulte: "moyen",
    question: "Quel est le synonyme du mot 'Formidable' ?",
    options: ["Triste", "Magnifique", "Difficile", "Ennuyeux"],
    reponseCorrecte: 1
  },
  // MATIÈRE : ARABE
  {
    titre: "الجملة الفعلية",
    description: "تمارين حول الفاعل والمفعول به في الجملة الفعلية.",
    matiere: "arabe",
    sousCat: "النحو والصرف",
    difficulte: "facile",
    question: "عين الفاعل في الجملة التالية: 'قَرَأَ التِّلْمِيذُ القِصَّةَ'",
    options: ["قَرَأَ", "التِّلْمِيذُ", "القِصَّةَ", "مستتر"],
    reponseCorrecte: 1
  },
  // MATIÈRE : MATHEMATIQUES
  {
    titre: "Les Fractions",
    description: "Comprendre et simplifier les fractions simples.",
    matiere: "maths",
    sousCat: "Numération",
    difficulte: "facile",
    question: "Si on partage un gâteau en 4 parts égales et qu'on en mange 2 parts, quelle fraction reste-t-il ?",
    options: ["1/4", "3/4", "2/4 (ou 1/2)", "4/4"],
    reponseCorrecte: 2
  },
  {
    titre: "Le Périmètre du Rectangle",
    description: "Calculer le contour d'une figure géométrique.",
    matiere: "maths",
    sousCat: "Géométrie & Mesures",
    difficulte: "moyen",
    question: "Un rectangle a une longueur de 8 cm and une largeur de 5 cm. Quel est son périmètre ?",
    options: ["13 cm", "26 cm", "40 cm", "20 cm"],
    reponseCorrecte: 1
  },
  // MATIÈRE : SCIENCES
  {
    titre: "Le Système Solaire",
    description: "Quiz de base sur l'ordre et la nature des planètes.",
    matiere: "sciences",
    sousCat: "Astronomie",
    difficulte: "facile",
    question: "Quelle est la planète la plus proche du Soleil ?",
    options: ["La Terre", "Mars", "Mercure", "Jupiter"],
    reponseCorrecte: 2
  },
  {
    titre: "Les États de la Matière",
    description: "Comprendre les changements d'état de l'eau.",
    matiere: "sciences",
    sousCat: "Physique",
    difficulte: "moyen",
    question: "Comment appelle-t-on le passage de l'état liquide à l'état gazeux ?",
    options: ["La fusion", "La solidification", "L'évaporation", "La condensation"],
    reponseCorrecte: 2
  },
  // MATIÈRE : HISTOIRE & GÉO
  {
    titre: "Les Reliefs de la Terre",
    description: "Identifier les grandes formes géographiques.",
    matiere: "histoire",
    sousCat: "Géographie",
    difficulte: "facile",
    question: "Comment appelle-t-on une vaste étendue de terre plate surélevée ?",
    options: ["Une montagne", "Une plaine", "Un plateau", "Une vallée"],
    reponseCorrecte: 2
  }
];

// On génère ces exercices pour TOUS les niveaux de 1 à 6 afin d'éviter les listes vides
const exercicesDeTest = [];
for (let n = 1; n <= 6; n++) {
  baseExercices.forEach(ex => {
    exercicesDeTest.push({ ...ex, niveau: n });
  });
}

const seedDB = async () => {
  try {
    console.log("🔄 Connexion à ta base de données via ta configuration...");
    await connecterDB(); 
    
    // Nettoyer la collection 'exercices'
    await Exercice.deleteMany({});
    console.log("🧹 Collection 'exercices' vidée.");

    // Insérer les exercices
    await Exercice.insertMany(exercicesDeTest);
    console.log("🚀 Données injectées avec succès pour tous les niveaux (1 à 6) !");
    
  } catch (error) {
    console.error("❌ Erreur lors du seeding :", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Connexion fermée.");
    process.exit(0);
  }
};

seedDB();