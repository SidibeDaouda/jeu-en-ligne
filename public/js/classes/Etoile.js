/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
class Etoile {
  constructor(id, canvas, ctx, hauteurDuSol) {
    this.id = id
    this.canvas = canvas
    this.ctx = ctx
    this.hauteurDuSol = hauteurDuSol
    // cordonné x ou l'etoile apparaitra
    this.x = canvas.width * Math.random()
    this.y = 0
    this.radius = scale(15, this.canvas)
    // vitesse de mouvement de la largeur à la hauteur
    this.velocite = scale(5, this.canvas)
    this.opacity = 1
    // le temps ou un fragment restent au sol
    this.tempsDeVie = 50
  }

  draw() {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.translate(this.x, this.y)
    this.ctx.moveTo(0, 0 - this.radius)
    for (let i = 0; i < 5; i++) {
      this.ctx.rotate(Math.PI / 5)
      this.ctx.lineTo(0, 0 - this.radius * 0.5)
      this.ctx.rotate(Math.PI / 5)
      this.ctx.lineTo(0, 0 - this.radius)
    }
    this.ctx.shadowColor = `rgba(255, 234, 70, ${this.opacity})`
    this.ctx.shadowBlur = 10
    this.ctx.fillStyle = `rgba(255, 234, 70, ${this.opacity})`
    this.ctx.fill()
    this.ctx.restore()
  }

  update() {
    if (
      this.y + this.radius <
      this.canvas.height - scale(this.hauteurDuSol, this.canvas)
    ) {
      this.y += this.velocite
    } else {
      this.tempsDeVie--
      this.opacity -= 1 / this.tempsDeVie
    }

    this.draw()

    // maintenir les variables a jour
    this.radius = scale(15, this.canvas)
    this.velocite = scale(5, this.canvas)
  }
}
