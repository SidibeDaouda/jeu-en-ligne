const mongoose = require('mongoose')

const ScoreSchema = new mongoose.Schema({
  monJoueurId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  monNom: {
    type: String,
    lowercase: true,
    trim: true,
  },
  monScore: {
    type: Number,
    lowercase: true,
    trim: true,
  },
  nomUtilisateurAutreJoueur: {
    type: String,
    lowercase: true,
    trim: true,
  },
  scoreAutreJoueur: {
    type: Number,
    lowercase: true,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

const Score = mongoose.model('Score', ScoreSchema)

module.exports = Score
