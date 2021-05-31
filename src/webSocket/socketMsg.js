const generateMessage = (nomUtilisateur, text) => ({
  nomUtilisateur,
  text,
  heureDenvoi: new Date().getTime(),
})

module.exports = {
  generateMessage,
}
