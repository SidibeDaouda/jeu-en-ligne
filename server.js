/* eslint-disable no-console */
const path = require('path')
const express = require('express')
const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
// const morgan = require('morgan')
require('dotenv').config()

// Dev Logginf Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(cors())
  // app.use(morgan('dev'))
}

// ajout de socket.io
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.io = io
// app.salons = []
app.salons = {}
require('./src/webSocket/indexSocket')({ io, salons: app.salons })
require('./src/config/passport')(passport)

// PUG
app.set('views', path.join(__dirname, './public/views'))
app.set('view engine', 'pug')

// body parser
app.use(bodyParser.urlencoded({ extended: true }))

// Express session
app.use(
  session({
    secret: process.env.SECRET,
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true,
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// mes fichier
app.use('/images', express.static(`${__dirname}/public/assets/images/`))
app.use('/js', express.static(`${__dirname}/public/js/`))
app.use('/sons', express.static(`${__dirname}/public/assets/sons/`))
app.use('/sprites', express.static(`${__dirname}/public/assets/sprites/`))
app.use('/tilesets', express.static(`${__dirname}/public/assets/tilesets/`))
app.use('/styles', express.static(`${__dirname}/public/assets/styles/`))
app.use('/vendor', express.static(`${__dirname}/public/assets/vendor/`))

// Connect flash
app.use(flash())

// variables Globales
app.use((req, res, next) => {
  res.locals.msg_succes = req.flash('msg_succes')
  res.locals.msg_erreur = req.flash('msg_erreur')
  res.locals.error = req.flash('error')
  next()
})

// Routes
app.use('/', require('./src/routes/index.js'))
app.use('/utilisateur', require('./src/routes/utilisateur.js'))
app.use('/salon', require('./src/routes/salon.js'))

app.use((req, res) => {
  res.status(404).json({
    success: false,
    msg: 'Page non éxistante',
  })
})

const PORT = process.env.PORT || 5000

const connectionOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGODB_URI, connectionOptions)
    .then(() => {
      console.log('Connecté à MongoDB avec succèss :)')
      server.listen(PORT, () => {
        console.log(
          `Le serveur a démarré sur le port ${PORT} => http://localhost:${PORT}`
        )
      })
    })
    .catch((e) => {
      console.log('Erreur de connexion à MongoDB')
      console.log(e)
    })
}

connectDB()
