/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-plusplus */
class Fragment {
  constructor(x, y, radius, canvas, ctx, hauteurDuSol) {
    this.canvas = canvas
    this.ctx = ctx
    this.hauteurDuSol = hauteurDuSol
    this.x = x
    this.y = y
    this.radius = scale(radius, this.canvas)
    // vitesse de mouvement de la largeur à la hauteur
    this.velocite = {
      x: scale((Math.random() - 0.5) * 4, this.canvas),
      y: scale(4, this.canvas),
    }
    // la force qui oppose une résistance au mouvement
    // (si une pointe/etoile touche le sol ou le sprite cette pointe sera repoussé a une force de 0.4 )
    this.friction = 0.4
    // la gravité
    this.gravite = 0.4
    // l'opacité quand un fragment touche au sol
    this.opacity = 1
    // le temps ou un fragment restent au sol
    this.tempsDeVie = 50
    this.color = `rgba(255,255,255,${this.opacity})`
  }

  draw() {
    // effet du fragment quand y touche le sol
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    this.ctx.fillStyle = `rgba(255,255,255,${this.opacity})`
    this.ctx.fill()
    this.ctx.closePath()
  }

  update() {
    if (
      this.y + this.velocite.y + this.radius >=
      this.canvas.height - scale(this.hauteurDuSol, this.canvas)
    ) {
      this.velocite.y = -this.velocite.y * this.friction
      this.velocite.x *= 0.9
    } else {
      this.velocite.y += this.gravite
    }

    this.x += this.velocite.x
    this.y += this.velocite.y
    this.draw()

    this.tempsDeVie--
    this.opacity -= 1 / this.tempsDeVie
  }
}
