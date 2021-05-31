/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
class Joueur {
  constructor(sprite, canvas, ctx, hauteurDuSol) {
    this.sprite = sprite
    this.canvas = canvas
    this.ctx = ctx
    this.hauteurDuSol = hauteurDuSol
    // cadre de l'image
    this.frameWidth = 90
    this.frameHeight = 113.9
    this.scaledFrameWidth = scale(this.frameWidth, this.canvas)
    this.scaledFrameHeight = scale(this.frameHeight, this.canvas)
    this.x = this.canvas.width / 2
    this.y =
      this.canvas.height -
      scale(this.hauteurDuSol, this.canvas) -
      scale(this.frameHeight, this.canvas)
    this.velocite = scale(10, this.canvas) // mouvement du joueur mise a jour en bas dans update
    this.frameNr = 1 // numero du sprite choisi
    this.runFrameCount = 16 // nombre de sprite pour la course
    this.idleFrameCount = 16 // nombre de sprite quand le joueur ne bouge pas
    this.deadFrameCount = 5 // nombre de sprite quand le joueur meurt
    this.frameXpos = {
      idRight: 0, // numero du sprite quand le joueur ne bouge pas (direction droite)
      idLeft: 90, // numero du sprite quand le joueur ne bouge pas (direction gauche)
      runningRight: 180, // numero du sprite quand le joueur court (direction droite)
      runningLeft: 270, // numero du sprite quand le joueur court (direction gauche)
      dead: 360, /// /numero du sprite quand le joueur meurt (direction gauche)
    }
    this.etat = {
      runningLeft: false,
      runningRight: false,
      idLeft: false,
      idRight: true,
      dead: false,
    }
  }

  deathAnim() {
    if (this.frameNr > 5) {
      this.frameNr = 5
    }
    const frameYpos = (this.frameNr - 1) * 125.5
    this.ctx.drawImage(
      this.sprite,
      this.frameXpos.dead,
      frameYpos,
      150,
      125.5,
      this.x,
      this.y + 15,
      scale(150, this.canvas),
      scale(125.5, this.canvas)
    )
    this.frameNr++
  }

  draw(frameXpos, frameCount) {
    if (this.frameNr > frameCount) {
      this.frameNr = 1
    }
    const frameYpos = (this.frameNr - 1) * this.frameHeight
    this.ctx.drawImage(
      this.sprite,
      frameXpos,
      frameYpos,
      this.frameWidth,
      this.frameHeight,
      this.x,
      this.y,
      this.scaledFrameWidth,
      100
    )
    this.frameNr++
  }

  update() {
    if (this.etat.runningRight) {
      this.draw(this.frameXpos.runningRight, this.runFrameCount)
      if (this.x + this.scaledFrameWidth < this.canvas.width) {
        this.x += this.velocite
      }
    } else if (this.etat.runningLeft) {
      this.draw(this.frameXpos.runningLeft, this.runFrameCount)
      if (this.x > 0) {
        this.x -= this.velocite
      }
    } else if (this.etat.idLeft) {
      this.draw(this.frameXpos.idLeft, this.idleFrameCount)
    } else if (this.etat.idRight) {
      this.draw(this.frameXpos.idRight, this.idleFrameCount)
    } else if (this.etat.dead) {
      this.deathAnim()
    }

    // maj des variables
    this.scaledFrameWidth = scale(this.frameWidth, this.canvas)
    this.scaledFrameHeight = scale(this.frameHeight, this.canvas)
    this.y =
      this.canvas.height -
      scale(this.hauteurDuSol, this.canvas) -
      scale(this.frameHeight, this.canvas)
    this.velocite = scale(10, this.canvas)
  }
}

// if (!this.navigator) {
//   module.exports = Joueur
// }
