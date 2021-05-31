/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
class Pointe {
  constructor(canvas, ctx) {
    this.canvas = canvas
    this.ctx = ctx
    this.x = this.canvas.width * Math.random()
    this.y = 0
    this.color = '#fff'
    this.width = scale(10, this.canvas)
    this.height = scale(50, this.canvas)
    // vitesse de descente de certaine pointes de la largeur à la hauteur
    this.velocite = scale(15, this.canvas)
  }

  draw() {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.moveTo(this.x, this.y)
    this.ctx.lineTo(this.x + this.width, this.y)
    this.ctx.lineTo(this.x + this.width / 2, this.y + this.height)
    this.ctx.shadowColor = '#E3EAEF'
    this.ctx.shadowBlur = 10
    this.ctx.fillStyle = this.color
    this.ctx.fill()
    this.ctx.closePath()
    this.ctx.restore()
  }

  update() {
    this.y += this.velocite
    this.draw()

    // maj les variables
    this.width = scale(10, this.canvas)
    this.height = scale(50, this.canvas)
    this.velocite = scale(15, this.canvas)
  }
}
