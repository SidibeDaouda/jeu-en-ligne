/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
const divLesScores = document.getElementById('lesScores')
const tabJour = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
]

if (lesScores.length > 0) {
  meilleurScore.forEach((leBestScore) => {
    // console.log('🚀 ~ leBestScore', leBestScore)
    const span = document.querySelector('.title.has-text-white')

    const uneDate = new Date(leBestScore.date)

    const dateToString = `
    ${
      tabJour[uneDate.getDay()]
    } ${uneDate.getDate()}/${uneDate.getMonth()}/${uneDate.getFullYear()} - ${uneDate.getHours()}:${uneDate.getMinutes()}`

    span.innerText = `${lesScores.length} partie(s) meilleur score: ${leBestScore.monScore} vs ${leBestScore.nomUtilisateurAutreJoueur} le ${dateToString}`
  })

  lesScores.forEach((unScore) => {
    // console.log(unScore)
    const div = document.createElement('div')
    const pResultat = document.createElement('p')
    const uneDate = new Date(unScore.date)
    const dateToString = `
    ${
      tabJour[uneDate.getDay()]
    } ${uneDate.getDate()}/${uneDate.getMonth()}/${uneDate.getFullYear()} - ${uneDate.getHours()}:${uneDate.getMinutes()}`

    div.classList.add('message', 'cardScoreWidth')

    if (unScore.monScore > unScore.scoreAutreJoueur) {
      pResultat.innerText = `Vous avez gagné`
      div.classList.add('is-info')
    } else if (unScore.monScore < unScore.scoreAutreJoueur) {
      pResultat.innerText = `Vous avez perdu`
      div.classList.add('is-danger')
    } else if (unScore.monScore === unScore.scoreAutreJoueur) {
      pResultat.innerText = `Vous avez fait Égalité`
      div.classList.add('is-warning')
    }
    div.innerHTML = `
        <div class="message-header">
          <p>${dateToString}</p>
        </div>
        <div class="message-body">
          <p>${unScore.monNom} vs ${unScore.nomUtilisateurAutreJoueur}</p>
          <p>Votre score: ${unScore.monScore}</p> 
          <p>${unScore.nomUtilisateurAutreJoueur} score: ${unScore.scoreAutreJoueur}</p>
          <p>${pResultat.textContent}</p>
        </div>
      <br/>
    `
    divLesScores.appendChild(div)
  })
} else {
  const div = document.createElement('div')
  div.innerHTML = `
    <p style="text-align: center;">
      Vous n'avez pas lancé de partie. :(  
    </p>

    <a href="/salon" style="color:blue">Cliquez ici pour consulter les salons </a>
  `
  divLesScores.appendChild(div)
}
