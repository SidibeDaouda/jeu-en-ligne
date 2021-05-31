const express = require('express')

const router = express.Router()
const { authentifie, assurerAuthentification } = require('../config/auth')
const Score = require('../models/Score')

// page d'accueil
router.get('/', (req, res) => res.redirect('/connexion'))

// Page de connexion
router.get('/connexion', authentifie, (req, res) => res.render('connexion'))

// Page d'inscription
router.get('/inscription', authentifie, (req, res) => res.render('inscription'))

// Page des stats du joueur
router.get('/stats', assurerAuthentification, async (req, res) => {
  await Score.find({
    monNom: req.user.nomUtilisateur,
  })
    .sort({ date: -1 })
    .then((lesScores) => {
      // console.log('🚀 ~ lesScores', lesScores)
      Score.find({ monNom: req.user.nomUtilisateur })
        .sort({ monScore: -1 })
        .limit(1)
        .then((meilleurScore) => {
          // console.log('🚀 ~ unScore', meilleurScore)
          res.render('statsJoueur', {
            utilisateur: req.user,
            lesScores,
            meilleurScore,
          })
        })
    })
})

// acces au profil
router.get('/profil', assurerAuthentification, (req, res) => {
  res.render('profil', { utilisateur: req.user })
})

module.exports = router
