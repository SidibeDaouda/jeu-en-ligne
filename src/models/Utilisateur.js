const mongoose = require('mongoose')

const UtilisateurSchema = new mongoose.Schema({
  nomUtilisateur: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true,
  },
  mdp: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

const Utilisateur = mongoose.model('Utilisateur', UtilisateurSchema)

module.exports = Utilisateur
