/* eslint-disable consistent-return */
/* eslint-disable no-console */
const {
  ajouterUtilisateur,
  supprimerUtilisateur,
  getUtilisateur,
  getUtilisateursDansLeSalon,
} = require('./socketUtilisateurs')

const { generateMessage } = require('./socketMsg')

module.exports = (discussionNsp) => {
  discussionNsp.on('connection', (socket) => {
    console.log('Nouveau Client(e) connecté(e) discution G')

    socket.on('join', ({ nomUtilisateur, room }, callback) => {
      const { error, utilisateur } = ajouterUtilisateur({
        id: socket.id,
        nomUtilisateur,
        room,
      })

      if (error) return callback(error)

      socket.join(utilisateur.room)

      socket.emit(
        'message',
        generateMessage('Admin', `Bienvenue ${utilisateur.nomUtilisateur} !`)
      )
      socket.broadcast
        .to(utilisateur.room)
        .emit(
          'message',
          generateMessage(
            'Admin',
            `${utilisateur.nomUtilisateur} a rejoint la partie !`
          )
        )

      discussionNsp.to(utilisateur.room).emit('roomData', {
        room: utilisateur.room,
        utilisateurs: getUtilisateursDansLeSalon(utilisateur.room),
      })

      callback()
    })

    socket.on('envoyerMessage', (message, callback) => {
      const utilisateur = getUtilisateur(socket.id)

      discussionNsp
        .to(utilisateur.room)
        .emit('message', generateMessage(utilisateur.nomUtilisateur, message))

      callback()
    })

    socket.on('disconnect', () => {
      const utilisateur = supprimerUtilisateur(socket.id)
      console.log(`Client(e) déconnecté(e) ${socket.id}`)
      if (utilisateur) {
        discussionNsp
          .to(utilisateur.room)
          .emit(
            'message',
            generateMessage(
              'Admin',
              `${utilisateur.nomUtilisateur} a quitté la partie !`
            )
          )
        discussionNsp.to(utilisateur.room).emit('roomData', {
          room: utilisateur.room,
          utilisateurs: getUtilisateursDansLeSalon(utilisateur.room),
        })
        socket.leave(utilisateur.room)
      }
    })
  })
}
