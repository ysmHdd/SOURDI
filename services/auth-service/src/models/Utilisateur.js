const mongoose = require("mongoose");

const avatarSchema = new mongoose.Schema(
  {
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "female",
    },

    style: {
      type: String,
      enum: [
        "adventurer",
        "avataaars",
        "lorelei",
        "notionists",
        "open-peeps",
        "micah",
        "personas",
      ],
      default: "adventurer",
    },

    seed: {
      type: String,
      default: "default-student",
      trim: true,
    },

    url: {
      type: String,
      default:
        "https://api.dicebear.com/9.x/adventurer/svg?seed=default-student",
    },
  },
  { _id: false }
);

const utilisateurSchema = new mongoose.Schema(
  {
    user_first_name: {
      type: String,
      required: true,
      trim: true,
    },

    user_last_name: {
      type: String,
      required: true,
      trim: true,
    },

    user_email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    user_dob: {
      type: Date,
      required: true,
    },

    user_phone: {
      type: String,
      required: true,
      trim: true,
    },

    params: {
      grade: String,
      gouvernorat: String,
      delegation: String,
      region: String,
      school_name: String,
    },

    avatar: {
      type: avatarSchema,
      default: () => ({}),
    },

    role: {
      type: String,
      enum: ["admin", "etudiant"],
      default: "etudiant",
    },

    emailConfirme: {
      type: Boolean,
      default: false,
    },

<<<<<<< HEAD
=======
    statutAcces: {
      type: String,
      enum: ["en_attente", "accepte", "refuse"],
      default: "en_attente",
    },
    banni: {
  type: Boolean,
  default: false,
},

banType: {
  type: String,
  enum: ["temporaire", "definitif", null],
  default: null,
},

banRaison: {
  type: String,
  default: "",
  trim: true,
},

banExpireLe: {
  type: Date,
  default: null,
},

>>>>>>> origin/notifcalendrier
    emailToken: {
      type: String,
    },

    emailTokenExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Utilisateur", utilisateurSchema);