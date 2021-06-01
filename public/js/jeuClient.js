/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
const salonClient = io.connect(window.location.hostname)
const jeuClient = io.connect(`${window.location.hostname}/jeu`)
const room = window.location.pathname.split('/').pop()
const chargement = document.getElementById('chargement')
const airDeJeu = document.getElementById('airDeJeu')
const canvas = document.getElementById('gameCanvas')
const menuDepart = document.getElementById('menuDepart')
const btnDepart = document.getElementById('btnDepart')
const finPartie = document.getElementById('finPartie')
const terminer = document.getElementById('terminer')
const ctx = canvas.getContext('2d')
const hauteurDuSol = 100
const sonDepart = new Audio('/sons/Forest Maze.ogg')
const sonJeu = new Audio('/sons/Heat.ogg')
const sonGameOver = new Audio('/sons/Death 1.ogg')
const sonCollisionEtoile = new Audio('/sons/Sound-006.wav')
const SpriteMario = new Image()
const SpriteLuigi = new Image()
SpriteMario.src = '/sprites/mario.png'
SpriteLuigi.src = '/sprites/luigi.png'

const minuteDepart = 1
let setCompteArebours
let temps = minuteDepart * 90
let mn
let sc
let etoiles
let minuteur
let tauxApparitionEtoile = EntierAleatoire(120, 180)
let verifAnim = false // verifier si l'animation et lancée
let monSprite = null
const tousLesSpriteDeAutresJoueurs = {}
let tousLesUtilsateurs // pour verifier si quelqu'un quitte la partie deja lancé

jeuClient.emit('join', { nomUtilisateur, room })

jeuClient.on('roomData', ({ room, utilisateurs, salons }) => {
  tousLesUtilsateurs = utilisateurs
  // console.log('🚀 ~ utilisateurs', utilisateurs)
  const paragrapheNbJoueur = document.querySelector('.nbJoueur')

  paragrapheNbJoueur.innerText = ` Joueur:  ${utilisateurs.length}/2`

  if (utilisateurs.length < 2) {
    btnDepart.classList.add('cacher')
  } else {
    paragrapheNbJoueur.innerText = `Joueur: ${utilisateurs.length}/2
    
    En attente que ${utilisateurs[0].nomUtilisateur} lance la partie`
  }

  jeuClient.emit('afficherBtnPlay', utilisateurs[0].id)

  jeuClient.on('afficherBtnPlay', (idJoueur1) => {
    if (utilisateurs[0].id === idJoueur1 && utilisateurs.length >= 2) {
      btnDepart.classList.remove('cacher')
      paragrapheNbJoueur.innerText = ` Joueur:  ${utilisateurs.length}/2
      ${utilisateurs[1].nomUtilisateur} attend votre départ`
    }
  })

  utilisateurs.forEach((unJoueur) => {
    if (
      unJoueur.nomUtilisateur.trim().toLowerCase() ===
      nomUtilisateur.trim().toLowerCase()
    ) {
      monSprite = new Joueur(
        unJoueur.id,
        unJoueur.nomUtilisateur,
        SpriteMario,
        canvas,
        ctx,
        hauteurDuSol,
        0
      )
    } else {
      tousLesSpriteDeAutresJoueurs[unJoueur.id] = new Joueur(
        unJoueur.id,
        unJoueur.nomUtilisateur,
        SpriteLuigi,
        canvas,
        ctx,
        hauteurDuSol,
        200
      )
    }
  })
})

btnDepart.addEventListener('click', (e) => {
  jeuClient.emit('startGame')
})

terminer.addEventListener('click', () => {
  location.href = '/salon'
})

jeuClient.on('init', () => {
  init()
})

// Initialisation/terminer
function init() {
  etoiles = []
  minuteur = 0
  verifAnim = true
  animate()
  compteurMaj()
  setCompteArebours = setInterval(compteurMaj, 1000)
  sonDepart.pause()
  sonDepart.currentTime = 0
  sonJeu.play()
  sonJeu.loop = true
  menuDepart.style.display = 'none'
  document.addEventListener('keydown', keyDown, false)
  document.addEventListener('keyup', keyUp, false)
}

// Animation boucle
function animate() {
  if (verifAnim) {
    if (tousLesUtilsateurs.length < 2) {
      sonJeu.pause()
      sonJeu.currentTime = 0
      verifAnim = false
      clearInterval(setCompteArebours)
      sonGameOver.play()
      sonGameOver.loop = false
      alert('Le joueur a quitté la partie :(')
      location.href = `/salon`
    }

    // efface et redessine l'animation
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // sol
    ctx.fillStyle = 'rgba(0,0,0,0.7)'
    ctx.fillRect(
      0,
      canvas.height - scale(hauteurDuSol, canvas),
      canvas.width,
      scale(hauteurDuSol, canvas)
    )

    // Je mets à jour mon perso si il est défini
    if (monSprite) {
      monSprite.update()
    }

    if (tousLesSpriteDeAutresJoueurs) {
      // Je mets à jour les autres persos si il y'en a
      for (const key in tousLesSpriteDeAutresJoueurs) {
        if (Object.hasOwnProperty.call(tousLesSpriteDeAutresJoueurs, key)) {
          const leSpriteDeUnAutreJoueur = tousLesSpriteDeAutresJoueurs[key]
          leSpriteDeUnAutreJoueur.update()
        }
      }
    }

    etoiles.forEach((etoile, index) => {
      etoile.update()

      // Collision Etoile-sol
      if (etoile.tempsDeVie <= 1) {
        // Destruction Etoile
        etoiles.splice(index, 1)
      }
      // Collision Etoile-Joueur
      if (
        etoile.x - etoile.radius < monSprite.x + monSprite.scaledFrameWidth &&
        etoile.x + etoile.radius > monSprite.x &&
        etoile.y - etoile.radius < monSprite.y + monSprite.scaledFrameHeight &&
        etoile.y + etoile.radius > monSprite.y
      ) {
        sonCollisionEtoile.play()
        sonCollisionEtoile.currentTime = 0
        // Destruction Etoile
        etoiles.splice(index, 1)

        // maj mon score
        if (monSprite) {
          monSprite.scoreUpdate()
          console.log('Mon score', monSprite.score)
          jeuClient.emit('score', monSprite)
        }

        if (tousLesSpriteDeAutresJoueurs) {
          for (const key in tousLesSpriteDeAutresJoueurs) {
            if (Object.hasOwnProperty.call(tousLesSpriteDeAutresJoueurs, key)) {
              const leSpriteDeUnAutreJoueur = tousLesSpriteDeAutresJoueurs[key]
              if (monSprite.id === leSpriteDeUnAutreJoueur.id) {
                leSpriteDeUnAutreJoueur.scoreUpdate()
              }
            }
          }
        }
      }
    })

    minuteur++

    // faire apparaitre etoiles
    if (minuteur % tauxApparitionEtoile === 0) {
      etoiles.push(new Etoile(idEtoile(), canvas, ctx, hauteurDuSol))
      console.log('etoiles', etoiles)
      tauxApparitionEtoile = EntierAleatoire(140, 280)
      // jeuClient.emit('etoiles', etoiles)
    }

    dessinerTemps()
    dessinerScore()
    requestAnimationFrame(animate)
  }
}

// jeuClient.on('etoiles', (etoiles) => {})

function compteurMaj() {
  if (temps <= 0) {
    clearInterval(setCompteArebours)
    verifAnim = false
    const monScore = document.getElementById('monScore')
    const resultat = document.getElementById('resultat')
    const autreScore = document.getElementById('autreScore')

    for (const key in tousLesSpriteDeAutresJoueurs) {
      if (Object.hasOwnProperty.call(tousLesSpriteDeAutresJoueurs, key)) {
        const leSpriteDeUnAutreJoueur = tousLesSpriteDeAutresJoueurs[key]

        if (monSprite.score > leSpriteDeUnAutreJoueur.score) {
          resultat.innerText = 'Vous avez gagné :D !'
        } else if (monSprite.score < leSpriteDeUnAutreJoueur.score) {
          resultat.innerText = `Vous avez perdu :( ${leSpriteDeUnAutreJoueur.nomUtilisateur} a gagné`
        } else if (monSprite.score === leSpriteDeUnAutreJoueur.score) {
          resultat.innerText = 'Égalité belle partie !'
        }

        monScore.innerText = `Votre score: ${monSprite.score}`

        autreScore.innerText = `${leSpriteDeUnAutreJoueur.nomUtilisateur} score: ${leSpriteDeUnAutreJoueur.score}`

        finPartie.style.display = 'block'

        const donneeJoueur = {
          monNom: nomUtilisateur,
          monScore: monSprite.score,
          nomUtilisateurAutreJoueur: leSpriteDeUnAutreJoueur.nomUtilisateur,
          scoreAutreJoueur: leSpriteDeUnAutreJoueur.score,
        }
        console.log('🚀 ~ donneeJoueur', donneeJoueur)
        jeuClient.emit('scoreFinDeJeu', donneeJoueur)
      }
    }
  }

  let minutes = Math.floor(temps / 60)
  let seconds = temps % 60

  minutes = minutes < 10 ? `0${minutes}` : minutes
  seconds = seconds < 10 ? `0${seconds}` : seconds
  mn = minutes
  sc = seconds
  temps--
}

function dessinerTemps() {
  ctx.font = `${scale(35, canvas)}px Arial`
  ctx.fillStyle = 'rgba(255,255,255,0.8)'

  ctx.fillText(
    `${mn}:${sc}`,
    canvas.width / 2,
    canvas.height - 0.35 * scale(hauteurDuSol, canvas)
  )
}

jeuClient.on('score', (unSprite) => {
  if (tousLesSpriteDeAutresJoueurs) {
    for (const key in tousLesSpriteDeAutresJoueurs) {
      if (Object.hasOwnProperty.call(tousLesSpriteDeAutresJoueurs, key)) {
        const leSpriteDeUnAutreJoueur = tousLesSpriteDeAutresJoueurs[key]
        if (unSprite.id === leSpriteDeUnAutreJoueur.id) {
          leSpriteDeUnAutreJoueur.score = unSprite.score
        }
      }
    }
  }
})

// Score
function dessinerScore() {
  ctx.font = `${scale(35, canvas)}px Arial`
  ctx.fillStyle = 'rgba(255,255,255,0.8)'

  if (monSprite) {
    ctx.fillText(
      `${monSprite.nomUtilisateur} score: ${monSprite.score}`,
      12,
      canvas.height - 0.35 * scale(hauteurDuSol, canvas)
    )
  }

  if (tousLesSpriteDeAutresJoueurs) {
    for (const key in tousLesSpriteDeAutresJoueurs) {
      if (Object.hasOwnProperty.call(tousLesSpriteDeAutresJoueurs, key)) {
        const leSpriteDeUnAutreJoueur = tousLesSpriteDeAutresJoueurs[key]
        // console.log('🚀 ~ leSpriteDeUnAutreJoueur', leSpriteDeUnAutreJoueur)

        ctx.fillText(
          `${leSpriteDeUnAutreJoueur.nomUtilisateur} Score: ${leSpriteDeUnAutreJoueur.score}`,
          canvas.width - 220,
          canvas.height - 0.35 * scale(hauteurDuSol, canvas)
        )
      }
    }
  }
}

jeuClient.on('deplacementMonJoueur', (leSprite) => {
  for (const key in tousLesSpriteDeAutresJoueurs) {
    if (Object.hasOwnProperty.call(tousLesSpriteDeAutresJoueurs, key)) {
      const leSpriteDeUnAutreJoueur = tousLesSpriteDeAutresJoueurs[key]
      if (leSprite.id === leSpriteDeUnAutreJoueur.id) {
        leSpriteDeUnAutreJoueur.etat = leSprite.etat
      }
    }
  }
})

// quand le monSprite appui sur la fleche gauche ou droite
function keyDown(e) {
  if (monSprite) {
    if (e.keyCode === 39) {
      monSprite.etat.runningRight = true
    } else if (e.keyCode === 37) {
      monSprite.etat.runningLeft = true
    }
    jeuClient.emit('deplacementMonJoueur', monSprite)
  }
}
// quand le monSprite relache la fleche gauche ou droite
function keyUp(e) {
  if (monSprite) {
    if (e.keyCode === 39) {
      monSprite.etat.runningRight = false
      monSprite.etat.idRight = true
      monSprite.etat.idLeft = false
    } else if (e.keyCode === 37) {
      monSprite.etat.runningLeft = false
      monSprite.etat.idRight = false
      monSprite.etat.idLeft = true
    }
    jeuClient.emit('deplacementMonJoueur', monSprite)
  }
}

// echelle du jeu
function scale(elem, canvas) {
  return (elem * canvas.height) / 1080
}

function EntierAleatoire(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// Event Listeners
window.addEventListener(
  'load',
  () => {
    reDimensionnerLeJeu()
    sonDepart.play()
    sonDepart.loop = true
    // Laisse le chargement s'exécuter pendant 1,5s, sinon, il se charge trop rapidement
    setTimeout(() => {
      chargement.style.display = 'none'
      airDeJeu.style.display = 'block'
    }, 1500)
  },
  false
)

window.addEventListener('resize', reDimensionnerLeJeu, false)

// echelle du canvas pour s'adapter à la fenêtre (16:9 ratio)
function reDimensionnerLeJeu() {
  const largeurAhauteur = 16 / 9
  let newLargeur = window.innerWidth
  let newHauteur = window.innerHeight - 150
  const newlargeurAhauteur = newLargeur / newHauteur

  if (newlargeurAhauteur > largeurAhauteur) {
    newLargeur = newHauteur * largeurAhauteur
    airDeJeu.style.height = `${newHauteur}px`
    airDeJeu.style.width = `${newLargeur}px`
  } else {
    newHauteur = newLargeur / largeurAhauteur
    airDeJeu.style.width = `${newLargeur}px`
    airDeJeu.style.height = `${newHauteur}px`
  }

  airDeJeu.style.marginTop = `${-newHauteur / 2}px`
  airDeJeu.style.marginLeft = `${-newLargeur / 2}px`

  canvas.width = newLargeur
  canvas.height = newHauteur
}

function idEtoile() {
  return `${Math.random().toString(36).substr(2, 9)}`
}
