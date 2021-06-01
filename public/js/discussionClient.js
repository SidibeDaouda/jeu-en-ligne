/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */

const discussionClient = io.connect(`${window.location.hostname}/discussion`)
// const jeuClient = io('http://localhost:5000/jeu')

const { nomUtilisateur, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
})

// ---------------------------------------------- chat ---------------------------------------------

// Quand l'utilisateur clique dur le bouton pour rejoindre le salon
discussionClient.emit('join', { nomUtilisateur, room }, (error) => {
  if (error) {
    alert(error)
    location.href = '/salon'
  }
})

// Une fois que l'utilisateur rejoint le salon
discussionClient.on('roomData', ({ utilisateurs }) => {
  const listeUtilisateurs = document.querySelector('#listeUtilisateurs')
  const listeUsersMobile = document.querySelector('#listeUsersMobile')
  listeUtilisateurs.innerHTML = ''
  listeUsersMobile.innerHTML = ''

  // parcourir les uilisateurs pour les affichers dans la liste
  for (let i = 0; i < utilisateurs.length; i++) {
    const p = document.createElement('p')
    const p2 = document.createElement('p')
    const utilisateur = `${utilisateurs[i].nomUtilisateur}`
    p.innerHTML = `${utilisateur}  <span><img src="/images/onlineIcon.png", alt="icon en ligne" /></span>`
    p2.innerHTML = `${utilisateur}  <span><img src="/images/onlineIcon.png", alt="icon en ligne" /></span>`
    listeUtilisateurs.appendChild(p)
    listeUsersMobile.appendChild(p2)
  }
})

// Quand un message est envoyé dans le salon
discussionClient.on('message', (message) => {
  const donnees = {
    msgNomUtilisateur: message.nomUtilisateur,
    message: message.text,
    heureDenvoi: moment(message.heureDenvoi).format('HH:mm '),
  }

  const chatBox = document.querySelector('.chatBox')
  const messageContainer = document.createElement('div')
  const messageBox = document.createElement('div')
  const infosMessages = document.createElement('p')
  const messagesText = document.createElement('p')
  let utilisateurActuel = false

  if (donnees.msgNomUtilisateur === nomUtilisateur.trim().toLowerCase()) {
    utilisateurActuel = true
  }

  if (!utilisateurActuel) {
    messageContainer.classList.add('messageContainer', 'justifyStart')
    infosMessages.classList.add('infosMessages', 'pl-10')
    messageBox.classList.add('messageBox', 'backgroundSecondary')
    messagesText.classList.add('messageText')
    messagesText.innerHTML = donnees.message
    infosMessages.innerHTML = ` ${donnees.msgNomUtilisateur}: ${donnees.heureDenvoi} `
    messageBox.appendChild(messagesText)
    messageContainer.appendChild(messageBox)
    messageContainer.appendChild(infosMessages)
    chatBox.appendChild(messageContainer)
  } else {
    messageContainer.classList.add('messageContainer', 'justifyEnd')
    infosMessages.classList.add('infosMessages', 'pr-10')
    messageBox.classList.add('messageBox', 'backgroundPrimary')
    messagesText.classList.add('messageText')
    messagesText.innerHTML = donnees.message
    infosMessages.innerHTML = ` ${donnees.msgNomUtilisateur}: ${donnees.heureDenvoi} `
    messageBox.appendChild(messagesText)
    messageContainer.appendChild(infosMessages)
    messageContainer.appendChild(messageBox)
    chatBox.appendChild(messageContainer)
  }

  chatBox.scrollTop = chatBox.scrollHeight
})

// Redimenssioner le chatBox pour le responsive
window.addEventListener('resize', () => {
  let column = document.querySelector('.customResponsive')
  if (window.innerWidth >= 1023) {
    column.classList.remove('is-12', 'is-mobile')
    column.classList.add('is-10', 'is-desktop')
  } else {
    column.classList.remove('is-10', 'is-desktop')
    column.classList.add('is-12', 'is-mobile')
  }
})
// Envoi d'un message => evenement submit du formulaire de message
const messageForm = document.querySelector('#envoyerMessage')
const contenuMessage = document.querySelector('#envoyerMessage input')
messageForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const message = contenuMessage.value

  discussionClient.emit('envoyerMessage', message, (error) => {
    contenuMessage.value = ''
    if (error) {
      return console.log(error)
    }
  })
})

// ---------------------------------------------- jeu ---------------------------------------------
