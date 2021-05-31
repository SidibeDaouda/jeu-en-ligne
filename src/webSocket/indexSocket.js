/* eslint-disable global-require */

// const salons = {}
// const salons = JSON.parse(process.env.salons)
module.exports = ({ io, salons }) => {
  // console.log('all salons', salons)
  const salonNsp = io.of('/')
  const jeuNsp = io.of('/jeu')
  const discussionNsp = io.of('/discussion')

  require('./discussionNsp')(discussionNsp)
  // require('./salon2')(salonNsp)
  require('./salonNsp')(salonNsp, salons)
  require('./jeuNsp')(jeuNsp, salonNsp, salons)
}
