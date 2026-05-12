const Produit = require("../models/Produit");
const SourdiCoins = require("../models/SourdiCoins");
const Transaction = require("../models/Transaction");
const Panier = require("../models/Panier");
const Utilisateur = require("../models/Utilisateur");

const obtenirProduits = async () => {
  return await Produit.find({
    disponible: true,
    stock: { $gt: 0 },
  }).sort({ createdAt: -1 });
};

const obtenirPanier = async (idUtilisateur) => {
  let panier = await Panier.findOne({ utilisateur: idUtilisateur }).populate(
    "produits.produit",
    "nom description prixEnCoins stock categorie disponible photo"
  );

  if (!panier) {
    panier = await Panier.create({
      utilisateur: idUtilisateur,
      produits: [],
    });

    panier = await Panier.findOne({ utilisateur: idUtilisateur }).populate(
      "produits.produit",
      "nom description prixEnCoins stock categorie disponible photo"
    );
  }

  const total = panier.produits.reduce((somme, item) => {
    if (!item.produit) return somme;
    return somme + item.produit.prixEnCoins * item.quantite;
  }, 0);

  return {
    panier,
    total,
  };
};

const ajouterAuPanier = async (idUtilisateur, idProduit, quantite = 1) => {
  const produit = await Produit.findById(idProduit);

  if (!produit) {
    throw new Error("Produit introuvable");
  }

  if (!produit.disponible) {
    throw new Error("Produit non disponible");
  }

  if (produit.stock <= 0) {
    throw new Error("Stock épuisé");
  }

  const quantiteDemandee = Number(quantite) || 1;

  if (quantiteDemandee < 1) {
    throw new Error("Quantité invalide");
  }

  let panier = await Panier.findOne({ utilisateur: idUtilisateur });

  if (!panier) {
    panier = await Panier.create({
      utilisateur: idUtilisateur,
      produits: [],
    });
  }

  const indexProduit = panier.produits.findIndex(
    (item) => item.produit.toString() === idProduit
  );

  if (indexProduit !== -1) {
    const nouvelleQuantite =
      panier.produits[indexProduit].quantite + quantiteDemandee;

    if (nouvelleQuantite > produit.stock) {
      throw new Error("Quantité demandée supérieure au stock disponible");
    }

    panier.produits[indexProduit].quantite = nouvelleQuantite;
  } else {
    if (quantiteDemandee > produit.stock) {
      throw new Error("Quantité demandée supérieure au stock disponible");
    }

    panier.produits.push({
      produit: idProduit,
      quantite: quantiteDemandee,
    });
  }

  await panier.save();

  return await obtenirPanier(idUtilisateur);
};

const modifierQuantitePanier = async (idUtilisateur, idProduit, quantite) => {
  const quantiteDemandee = Number(quantite);

  if (!quantiteDemandee || quantiteDemandee < 1) {
    throw new Error("Quantité invalide");
  }

  const produit = await Produit.findById(idProduit);

  if (!produit) {
    throw new Error("Produit introuvable");
  }

  if (quantiteDemandee > produit.stock) {
    throw new Error("Quantité demandée supérieure au stock disponible");
  }

  const panier = await Panier.findOne({ utilisateur: idUtilisateur });

  if (!panier) {
    throw new Error("Panier introuvable");
  }

  const item = panier.produits.find(
    (element) => element.produit.toString() === idProduit
  );

  if (!item) {
    throw new Error("Produit introuvable dans le panier");
  }

  item.quantite = quantiteDemandee;

  await panier.save();

  return await obtenirPanier(idUtilisateur);
};

const supprimerDuPanier = async (idUtilisateur, idProduit) => {
  const panier = await Panier.findOne({ utilisateur: idUtilisateur });

  if (!panier) {
    throw new Error("Panier introuvable");
  }

  panier.produits = panier.produits.filter(
    (item) => item.produit.toString() !== idProduit
  );

  await panier.save();

  return await obtenirPanier(idUtilisateur);
};

const viderPanier = async (idUtilisateur) => {
  let panier = await Panier.findOne({ utilisateur: idUtilisateur });

  if (!panier) {
    panier = await Panier.create({
      utilisateur: idUtilisateur,
      produits: [],
    });
  }

  panier.produits = [];
  await panier.save();

  return await obtenirPanier(idUtilisateur);
};

const acheterProduit = async (idUtilisateur, idProduit, adresseLivraison) => {
  const utilisateur = await Utilisateur.findById(idUtilisateur);

  if (!utilisateur) {
    throw new Error("Utilisateur introuvable");
  }

  const produit = await Produit.findById(idProduit);

  if (!produit) {
    throw new Error("Produit introuvable");
  }

  if (!produit.disponible) {
    throw new Error("Produit non disponible");
  }

  if (produit.stock <= 0) {
    throw new Error("Stock épuisé");
  }

  const coins = await SourdiCoins.findOne({ utilisateur: idUtilisateur });

  if (!coins) {
    throw new Error("Solde introuvable");
  }

  if (coins.solde < produit.prixEnCoins) {
    throw new Error("Solde insuffisant");
  }

  coins.solde -= produit.prixEnCoins;
  produit.stock -= 1;

  if (produit.stock === 0) {
    produit.disponible = false;
  }

  await coins.save();
  await produit.save();

  const transaction = await Transaction.create({
    utilisateur: idUtilisateur,
    produit: idProduit,
    quantite: 1,
    montantEnCoins: produit.prixEnCoins,
    client: {
      nom: `${utilisateur.user_first_name} ${utilisateur.user_last_name}`,
      email: utilisateur.user_email,
      telephone: utilisateur.user_phone,
    },
    adresseLivraison,
    statut: "reussi",
  });

  return {
    message: "Achat réussi",
    transaction,
    soldeRestant: coins.solde,
  };
};

const validerPanier = async (idUtilisateur, adresseLivraison) => {
  if (
    !adresseLivraison ||
    !adresseLivraison.adresse ||
    !adresseLivraison.gouvernorat ||
    !adresseLivraison.delegation
  ) {
    throw new Error("Adresse, gouvernorat et délégation sont requis");
  }

  const utilisateur = await Utilisateur.findById(idUtilisateur);

  if (!utilisateur) {
    throw new Error("Utilisateur introuvable");
  }

  const panier = await Panier.findOne({ utilisateur: idUtilisateur }).populate(
    "produits.produit"
  );

  if (!panier || panier.produits.length === 0) {
    throw new Error("Panier vide");
  }

  let total = 0;

  for (const item of panier.produits) {
    if (!item.produit) {
      throw new Error("Un produit du panier est introuvable");
    }

    if (!item.produit.disponible) {
      throw new Error(`Produit non disponible : ${item.produit.nom}`);
    }

    if (item.produit.stock < item.quantite) {
      throw new Error(`Stock insuffisant pour : ${item.produit.nom}`);
    }

    total += item.produit.prixEnCoins * item.quantite;
  }

  const coins = await SourdiCoins.findOne({ utilisateur: idUtilisateur });

  if (!coins) {
    throw new Error("Solde introuvable");
  }

  if (coins.solde < total) {
    throw new Error("Solde insuffisant");
  }

  coins.solde -= total;
  await coins.save();

  const transactions = [];

  for (const item of panier.produits) {
    item.produit.stock -= item.quantite;

    if (item.produit.stock === 0) {
      item.produit.disponible = false;
    }

    await item.produit.save();

    const transaction = await Transaction.create({
      utilisateur: idUtilisateur,
      produit: item.produit._id,
      quantite: item.quantite,
      montantEnCoins: item.produit.prixEnCoins * item.quantite,
      client: {
        nom: `${utilisateur.user_first_name} ${utilisateur.user_last_name}`,
        email: utilisateur.user_email,
        telephone: utilisateur.user_phone,
      },
      adresseLivraison: {
        adresse: adresseLivraison.adresse,
        gouvernorat: adresseLivraison.gouvernorat,
        delegation: adresseLivraison.delegation,
        codePostal: adresseLivraison.codePostal || "",
        note: adresseLivraison.note || "",
      },
      statut: "reussi",
    });

    transactions.push(transaction);
  }

  panier.produits = [];
  await panier.save();

  return {
    message: "Commande validée avec succès",
    total,
    soldeRestant: coins.solde,
    transactions,
    client: {
      nom: `${utilisateur.user_first_name} ${utilisateur.user_last_name}`,
      email: utilisateur.user_email,
      telephone: utilisateur.user_phone,
    },
    adresseLivraison,
  };
};

const obtenirHistoriqueAchats = async (idUtilisateur) => {
  return await Transaction.find({ utilisateur: idUtilisateur })
    .populate("produit", "nom description prixEnCoins categorie photo")
    .sort({ createdAt: -1 });
};

module.exports = {
  obtenirProduits,
  acheterProduit,
  obtenirHistoriqueAchats,
  obtenirPanier,
  ajouterAuPanier,
  modifierQuantitePanier,
  supprimerDuPanier,
  viderPanier,
  validerPanier,
};