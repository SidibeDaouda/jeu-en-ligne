/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */

document.addEventListener('DOMContentLoaded', () => {
  const $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll('.navbar-burger'),
    0
  )
  if ($navbarBurgers.length > 0) {
    $navbarBurgers.forEach(($el) => {
      $el.addEventListener('click', () => {
        const { target } = $el.dataset
        const $target = document.getElementById(target)

        $el.classList.toggle('is-active')
        $target.classList.toggle('is-active')
      })
    })
  }

  let $notification = document.querySelectorAll('.notification .delete') || []

  $notification.forEach(($delete) => {
    // console.log($delete.parentNode);
    $notification = $delete.parentNode

    $delete.addEventListener('click', () => {
      $notification.parentNode.removeChild($notification)
    })
  })
})

// function supprimerToucheEspace () {
//   if (event.keyCode == 32) {
//     alert('Espace interdit dans champs')
//     return false
//   }
// }

function openTab(evt, tabName) {
  let i
  let x
  let tablinks
  x = document.getElementsByClassName('content-tab')
  for (i = 0; i < x.length; i++) {
    x[i].style.display = 'none'
  }
  tablinks = document.getElementsByClassName('tab')
  for (i = 0; i < x.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' is-active', '')
  }
  document.getElementById(tabName).style.display = 'block'
  evt.currentTarget.className += ' is-active'
}
