/* eslint-disable no-undef */
const salonClient = io(window.location.hostname, {
  transports: ['websocket'],
})
const roomName = 'salonGeneral'
const partieDisponible = document.querySelector('.partieDisponible')
const lancerJeuForm = document.querySelector('.lancerJeuForm')
const room = document.getElementById('room')

/// ==========  PARTIE SALON (rejoindre le salon principal) =========

salonClient.emit('join', { nomUtilisateur, roomName }, (error) => {
  if (error) {
    alert(error)
    location.href = '/'
  }
})

lancerJeuForm.addEventListener('submit', () => {
  room.value = `${Math.random().toString(36).substr(2, 9)}`
})

/// ================  PARTIE SALONS DE JEU SOCKET ===========

salonClient.on('majSalonDeJeu', (lesSalons) => {
  console.log('salons maj salon', lesSalons)

  partieDisponible.innerHTML = ''
  if (Object.keys(lesSalons).length === 0) {
    partieDisponible.innerHTML = `<p> Aunce partie de jeu disponible<br/>Lancer une partie pour jouer</p>`
  } else {
    for (const key in lesSalons) {
      if (Object.hasOwnProperty.call(lesSalons, key)) {
        const divUnSalon = document.createElement('div')
        const unSalon = lesSalons[key]
        if (unSalon && unSalon.utilisateurs.length === 1) {
          divUnSalon.id = key
          divUnSalon.innerHTML = `<p>
              salon de ${unSalon.nomProprietaire} -
              <a class="lienSalon" href="salon/salonDeJeu/${key}"> Rejoindre</a>
            </p> `
          partieDisponible.append(divUnSalon)
        } else {
          delete salons[key]
          salonClient.emit('supprimerDiv', salons)
        }
      }
    }
  }
})
