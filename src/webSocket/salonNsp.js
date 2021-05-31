const {
  ajouterUtilisateur,
  supprimerUtilisateur,
} = require('./socketUtilisateurs')

module.exports = (salonNsp, salons) => {
  salonNsp.on('connection', (socket) => {
    console.log('nouvelle connection au /salon')

    socket.on('join', ({ nomUtilisateur, roomName }, callback) => {
      const { error, utilisateur } = ajouterUtilisateur({
        id: socket.id,
        nomUtilisateur,
        room: roomName,
      })

      if (error) return callback(error)
      socket.join(utilisateur.room)

      salonNsp.emit('majSalonDeJeu', salons)

      return callback()
    })

    socket.on('supprimerDiv', (lesSalons) => {
      salonNsp.emit('majSalonDeJeu', lesSalons)
    })

    socket.on('disconnect', () => {
      const utilisateur = supprimerUtilisateur(socket.id)
      if (utilisateur) {
        socket.leave(utilisateur.room)
      }
    })
  })
}

//= ======================== A faire ============================
