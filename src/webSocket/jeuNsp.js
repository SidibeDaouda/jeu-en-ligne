const Score = require('../models/Score')

module.exports = (jeuNsp, salonNsp, salons) => {
  jeuNsp.on('connection', (socket) => {
    console.log('nouvelle connection jeu')

    let utilisateur

    socket.on('join', ({ nomUtilisateur, room }) => {
      utilisateur = { id: socket.id, nomUtilisateur, room }

      if (salons[room].id === utilisateur.room) {
        salons[room].utilisateurs.push(utilisateur)
      }

      socket.join(room)

      jeuNsp.to(room).emit('roomData', {
        room,
        utilisateurs: salons[room].utilisateurs,
        salons,
      })
      salonNsp.emit('majSalonDeJeu', salons)
    })

    socket.on('afficherBtnPlay', (idJoueur1) => {
      socket.broadcast.to(idJoueur1).emit('afficherBtnPlay', idJoueur1)
    })

    socket.on('startGame', () => {
      jeuNsp.to(utilisateur.room).emit('init')
      jeuNsp.to(utilisateur.room).emit('etoiles')
    })

    socket.on('deplacementMonJoueur', (monSprite) => {
      jeuNsp.to(utilisateur.room).emit('deplacementMonJoueur', monSprite)
    })

    socket.on('score', (unSprite) => {
      jeuNsp.to(utilisateur.room).emit('score', unSprite)
    })

    // socket.on('etoiles', (etoiles) => {
    //   jeuNsp.to(utilisateur.room).emit('etoiles', etoiles)
    // })

    socket.on('scoreFinDeJeu', (donneeJoueur) => {
      const donneesJoueurs = new Score(donneeJoueur)
      donneesJoueurs
        .save()
        .then((item) => {
          console.log('élément enregistré dans la base de données')
          console.log('🚀 ~ item', item)
        })
        .catch((err) => {
          console.log("impossible d'enregistrer dans la base de données")
          console.log('🚀 ~ err', err)
        })
    })

    socket.on('disconnect', () => {
      const unUtilisateur = utilisateur
      const { room } = unUtilisateur

      for (const key in salons) {
        if (Object.hasOwnProperty.call(salons, key)) {
          const unSalon = salons[key]
          unSalon.utilisateurs.forEach((user, index) => {
            if (unUtilisateur.id === user.id) {
              unSalon.utilisateurs.splice(index, 1)
            }

            if (unSalon.utilisateurs.length <= 0) {
              delete salons[key]
            }

            if (unSalon) {
              jeuNsp.to(unUtilisateur.room).emit('roomData', {
                room,
                utilisateurs: unSalon.utilisateurs,
                salons,
              })
            }
          })
        }
      }
      salonNsp.emit('majSalonDeJeu', salons)
      console.log(`Client(e) déconnecté(e) ${socket.id}`)
    })
  })
}
