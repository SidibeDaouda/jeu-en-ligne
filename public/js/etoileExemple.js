etoile
etoiles.forEach((etoile, index) => {
  // console.log('🚀 ~ etoile', etoile)
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
