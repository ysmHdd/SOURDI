
require("dotenv").config();
const mongoose = require("mongoose");
const Exercice = require("./src/models/Exercice");

const exercices = [
  // FRANÇAIS niveau 1
  { matiere: "francais", niveau: 1, sousCat: "alphabet", question: "Quelle lettre fait le son /b/ ?", options: ["B", "D", "P", "Q"], reponse: 0, points: 10 },
  { matiere: "francais", niveau: 1, sousCat: "alphabet", question: "Combien de voyelles dans l'alphabet ?", options: ["4", "5", "6", "7"], reponse: 1, points: 10 },
  { matiere: "francais", niveau: 1, sousCat: "couleurs", question: "De quelle couleur est le soleil ?", options: ["Bleu", "Vert", "Rouge", "Jaune"], reponse: 3, points: 10 },
  { matiere: "francais", niveau: 1, sousCat: "couleurs", question: "Bleu + jaune = ?", options: ["Rouge", "Violet", "Vert", "Orange"], reponse: 2, points: 10 },

  // FRANÇAIS niveau 3
  { matiere: "francais", niveau: 3, sousCat: "grammaire", question: "Féminin de 'beau' ?", options: ["Beaux", "Belle", "Belles", "Beau"], reponse: 1, points: 10 },
  { matiere: "francais", niveau: 3, sousCat: "grammaire", question: "Pluriel de 'cheval' ?", options: ["Chevals", "Chevaux", "Chevales", "Chevauls"], reponse: 1, points: 10 },
  { matiere: "francais", niveau: 3, sousCat: "conjugaison", question: "Conjugue 'avoir' à 'nous' :", options: ["Avons", "Avez", "Ont", "As"], reponse: 0, points: 10 },
  { matiere: "francais", niveau: 3, sousCat: "vocabulaire", question: "Contraire de 'grand' ?", options: ["Gros", "Long", "Petit", "Court"], reponse: 2, points: 10 },

  // FRANÇAIS niveau 5
  { matiere: "francais", niveau: 5, sousCat: "conjugaison", question: "Passé composé de 'je mange' ?", options: ["Je mangeais", "J'ai mangé", "J'avais mangé", "Je mangerai"], reponse: 1, points: 15 },
  { matiere: "francais", niveau: 5, sousCat: "grammaire", question: "Nature de 'rapidement' ?", options: ["Adjectif", "Verbe", "Adverbe", "Nom"], reponse: 2, points: 15 },

  // MATHS niveau 1
  { matiere: "maths", niveau: 1, sousCat: "addition", question: "3 + 5 = ?", options: ["7", "8", "9", "6"], reponse: 1, points: 10 },
  { matiere: "maths", niveau: 1, sousCat: "addition", question: "6 + 4 = ?", options: ["9", "11", "10", "8"], reponse: 2, points: 10 },
  { matiere: "maths", niveau: 1, sousCat: "soustraction", question: "10 - 4 = ?", options: ["5", "7", "6", "8"], reponse: 2, points: 10 },
  { matiere: "maths", niveau: 1, sousCat: "soustraction", question: "9 - 3 = ?", options: ["5", "6", "7", "4"], reponse: 1, points: 10 },
  { matiere: "maths", niveau: 2, sousCat: "formes", question: "Combien de côtés a un triangle ?", options: ["2", "4", "3", "5"], reponse: 2, points: 10 },

  // MATHS niveau 3
  { matiere: "maths", niveau: 3, sousCat: "multiplication", question: "7 × 8 = ?", options: ["54", "56", "58", "52"], reponse: 1, points: 10 },
  { matiere: "maths", niveau: 3, sousCat: "multiplication", question: "6 × 9 = ?", options: ["52", "56", "54", "58"], reponse: 2, points: 10 },
  { matiere: "maths", niveau: 3, sousCat: "division", question: "48 ÷ 6 = ?", options: ["6", "7", "8", "9"], reponse: 2, points: 10 },

  // MATHS niveau 5
  { matiere: "maths", niveau: 5, sousCat: "fractions", question: "Fraction équivalente à 1/2 ?", options: ["2/5", "3/6", "4/9", "2/3"], reponse: 1, points: 15 },
  { matiere: "maths", niveau: 5, sousCat: "geometrie", question: "Périmètre d'un carré de côté 5 cm ?", options: ["10 cm", "20 cm", "25 cm", "15 cm"], reponse: 1, points: 15 },
  { matiere: "maths", niveau: 5, sousCat: "decimaux", question: "3,5 + 1,25 = ?", options: ["4,50", "4,75", "5,25", "4,25"], reponse: 1, points: 15 },

  // ARABE niveau 1
  { matiere: "arabe", niveau: 1, sousCat: "alphabet", question: "Quelle est cette lettre : ب ?", options: ["ت", "ب", "ث", "ن"], reponse: 1, points: 10, langue: "ar" },
  { matiere: "arabe", niveau: 1, sousCat: "alphabet", question: "Quelle est cette lettre : م ?", options: ["ن", "و", "م", "ه"], reponse: 2, points: 10, langue: "ar" },
  { matiere: "arabe", niveau: 1, sousCat: "vocabulaire", question: "Comment dit-on 'maison' en arabe ?", options: ["كتاب", "بيت", "قلم", "باب"], reponse: 1, points: 10, langue: "ar" },
  { matiere: "arabe", niveau: 3, sousCat: "conjugaison", question: "Conjugue 'كتب' à la 1ère personne :", options: ["يكتب", "تكتب", "أكتب", "نكتب"], reponse: 2, points: 10, langue: "ar" },
  { matiere: "arabe", niveau: 3, sousCat: "grammaire", question: "Pluriel de 'كتاب' ?", options: ["كتابات", "كتب", "أكتب", "كتابين"], reponse: 1, points: 10, langue: "ar" },

  // SCIENCES niveau 3
  { matiere: "sciences", niveau: 3, sousCat: "animaux", question: "Quel animal est un mammifère ?", options: ["Aigle", "Grenouille", "Chat", "Serpent"], reponse: 2, points: 10 },
  { matiere: "sciences", niveau: 3, sousCat: "plantes", question: "Quelle partie fait la photosynthèse ?", options: ["Racine", "Tige", "Feuille", "Fleur"], reponse: 2, points: 10 },
  { matiere: "sciences", niveau: 3, sousCat: "corps", question: "Combien de sens a l'être humain ?", options: ["3", "4", "5", "6"], reponse: 2, points: 10 },

  // SCIENCES niveau 5
  { matiere: "sciences", niveau: 5, sousCat: "physique", question: "L'eau bout à quelle température ?", options: ["90°C", "100°C", "80°C", "110°C"], reponse: 1, points: 15 },
  { matiere: "sciences", niveau: 5, sousCat: "physique", question: "Planète la plus proche du soleil ?", options: ["Vénus", "Terre", "Mercure", "Mars"], reponse: 2, points: 15 },
  { matiere: "sciences", niveau: 6, sousCat: "corps", question: "Quel organe filtre le sang ?", options: ["Poumon", "Foie", "Rein", "Cœur"], reponse: 2, points: 15 },

  // HISTOIRE niveau 5
  { matiere: "histoire", niveau: 5, sousCat: "tunisie", question: "Capitale de la Tunisie ?", options: ["Sfax", "Sousse", "Tunis", "Bizerte"], reponse: 2, points: 15 },
  { matiere: "histoire", niveau: 5, sousCat: "tunisie", question: "Année d'indépendance de la Tunisie ?", options: ["1952", "1956", "1960", "1948"], reponse: 1, points: 15 },
  { matiere: "histoire", niveau: 6, sousCat: "tunisie", question: "Fleuve qui traverse le nord de la Tunisie ?", options: ["Nil", "Medjerda", "Loire", "Sebou"], reponse: 1, points: 15 },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Exercice.deleteMany({});
  await Exercice.insertMany(exercices);
  console.log(`✅ ${exercices.length} exercices insérés`);
  mongoose.disconnect();
};

seed().catch((err) => {
  console.error("Erreur seed :", err);
  mongoose.disconnect();
});

