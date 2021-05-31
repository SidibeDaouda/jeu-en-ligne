/* eslint-disable no-shadow */
/* eslint-disable no-console */
const express = require('express')

const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

//  Utilisateur model
const Utilisateur = require('../models/Utilisateur')

const { assurerAuthentification } = require('../config/auth')

// post inscription
router.post('/inscription', (req, res, next) => {
  const { nomUtilisateur, email, mdp, mdp2 } = req.body

  const erreurs = {}

  if (!nomUtilisateur || !email || !mdp || !mdp2) {
    erreurs.champsVides = 'Veuillez entrer tous les champs'
  } else {
    if (mdp !== mdp2) {
      erreurs.mdpDifferent = 'Les mots de passe ne correspondent pas'
    }

    if (mdp.length < 6) {
      erreurs.longueurMdp = 'Le mot de passe doit être au moins de 6 caractères'
    }
  }

  if (Object.keys(erreurs).length > 0) {
    res.render('inscription', {
      erreurs,
      nomUtilisateur,
      email,
      mdp,
      mdp2,
    })
  } else {
    Utilisateur.findOne({
      $or: [
        {
          email,
        },
        {
          nomUtilisateur,
        },
      ],
    }).then((utilisateur) => {
      if (utilisateur) {
        if (utilisateur.nomUtilisateur === nomUtilisateur) {
          erreurs.nomUtilisateur = "Nom d'utilisateur déja éxistant"
        }
        if (utilisateur.email === email) {
          erreurs.email = "L'email existe déjà"
        }
        res.render('inscription', {
          erreurs,
          nomUtilisateur,
          email,
          mdp,
          mdp2,
        })
      } else {
        const newUser = new Utilisateur({
          nomUtilisateur,
          email,
          mdp,
        })

        bcrypt.genSalt(10, (erreur, salt) => {
          bcrypt.hash(newUser.mdp, salt, (erreur, hash) => {
            if (erreur) throw erreur
            newUser.mdp = hash
            newUser
              .save()
              .then((utilisateur) => {
                req.login(utilisateur, (erreur) => {
                  if (erreur) {
                    return next(erreur)
                  }
                  return res.redirect('/salon')
                })
              })
              .catch((erreur) => console.log(erreur))
          })
        })
      }
    })
  }
})

// modifier le profil
router.post('/editer-profil', assurerAuthentification, (req, res) => {
  const { idUtilisateur, nouveauNomUtilisateur } = req.body
  const opts = { runValidators: true, context: 'query' }

  Utilisateur.findOneAndUpdate(
    { _id: idUtilisateur },
    { nomUtilisateur: nouveauNomUtilisateur },
    opts,
    (err, doc) => {
      // console.log('doc', doc)
      if (!err) {
        req.flash('msg_succes', 'Modification réussie')
      } else {
        req.flash('msg_erreur', " Ce nom d'utilisateur est déjà pris")
        console.log(`Erreur lors de la mise à jour : ${err}`)
      }

      res.redirect('/profil')
    }
  )
})

// Login
router.post('/connexion', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/salon',
    failureRedirect: '/connexion',
    badRequestMessage: 'Veuillez entrer tous les champs',
    failureFlash: true,
  })(req, res, next)
})

// Déconnexion
router.get('/deconnexion', (req, res) => {
  req.logout()
  req.flash('msg_succes', 'Vous êtes déconnecté')
  res.redirect('/connexion')
})

module.exports = router
