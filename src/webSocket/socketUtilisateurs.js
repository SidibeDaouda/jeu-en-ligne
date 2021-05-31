/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
const utilisateurs = []

const ajouterUtilisateur = ({ id, nomUtilisateur, room }) => {
  nomUtilisateur = nomUtilisateur.trim().toLowerCase()
  room = room === undefined ? '' : room.trim().toLowerCase()

  const utilisateurExist = utilisateurs.find(
    (utilisateur) =>
      utilisateur.room === room && utilisateur.nomUtilisateur === nomUtilisateur
  )

  // if (!nomUtilisateur || !room) return { error: " saisir le nomUtilisateur et la room." }
  if (utilisateurExist) return { error: "Nom d'utilisateur déjà pris." }

  const utilisateur = { id, nomUtilisateur, room }

  utilisateurs.push(utilisateur)

  return { utilisateur }
}

const supprimerUtilisateur = (id) => {
  const index = utilisateurs.findIndex((utilisateur) => utilisateur.id === id)
  if (index !== -1) return utilisateurs.splice(index, 1)[0]
}

const getUtilisateur = (id) =>
  utilisateurs.find((utilisateur) => utilisateur.id === id)

const getUtilisateursDansLeSalon = (room) =>
  utilisateurs.filter((utilisateur) => utilisateur.room === room)

module.exports = {
  ajouterUtilisateur,
  supprimerUtilisateur,
  getUtilisateur,
  getUtilisateursDansLeSalon,
}
