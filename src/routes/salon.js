const express = require('express')
const { assurerAuthentification } = require('../config/auth')

const router = express.Router()

// acces a la page d'index du salon (/salon)
router.get('/', assurerAuthentification, (req, res) => {
  res.render('salon', {
    utilisateur: req.user,
    salons: req.app.salons,
  })
})

// acces discussion générale (/salon/discussion&jeu)
router.get('/discussion&jeu', assurerAuthentification, (req, res) => {
  res.render('discussionForm.pug', { utilisateur: req.user })
})

router.post('/salonDeJeu/room', assurerAuthentification, (req, res) => {
  const { salons } = req.app
  const nomProprietaire = req.user.nomUtilisateur
  const { room } = req.body
  salons[room] = { id: room, nomProprietaire, utilisateurs: [] }
  res.redirect(room)
})

// identifiant du salon
router.get('/salonDeJeu/:room', (req, res) => {
  if (req.params.room == null) res.redirect('/')
  res.render('jeu', {
    room: req.params.room,
    utilisateur: req.user,
  })
})

module.exports = router
