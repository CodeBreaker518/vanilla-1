let carrito = {}
//principal elements
const cards = document.querySelector('#cards')
const items = document.querySelector('#items')
const footer = document.querySelector('#footer')

//templates
const templateFooter = document.querySelector('#template-footer').content
const templateCarrito = document.querySelector('#template-carrito').content
const templateCard = document.querySelector('#template-card').content
const fragment = document.createDocumentFragment()

document.addEventListener('DOMContentLoaded', e =>{
  cargaDatosBD()
})
cards.addEventListener('click', e =>{
  // console.log(e)
  addCarrito(e)
})

const addCarrito = (e) => {
  if (e.target.classList.contains('btn-dark')){
    setCarrito(e.target.parentElement)
  }
  e.stopPropagation()
}

const setCarrito = (item) => {
  const product = {
    id: item.querySelector('button').dataset.id,
    title: item.querySelector('h5').textContent,
    price: item.querySelector('p').textContent,
    quantity: 1
  }
  if (carrito.hasOwnProperty(product.id)) {
    product.quantity = carrito[product.id].quantity + 1
  }
  carrito[product.id] = { ...product}
  pintarCarrito()
  // console.log(product, carrito)
}
const pintarCarrito = () => {
  items.innerHTML = ''
  Object.values(carrito).forEach(product => {
    templateCarrito.querySelector('th').textContent = product.id

    const clone = templateCarrito.cloneNode(true)
    fragment.appendChild(clone)
  })
  items.appendChild(fragment)
}

const cargaDatosBD = async () => {
  const response = await fetch('../db/api.json')
  const data = await response.json()
  pintarCards(data)
  //console.log(data)
}

const pintarCards = (data) => {
  data.forEach((item) => {
    console.log(item)
    templateCard.querySelector('h5').textContent = item.title
    templateCard.querySelector('p').textContent = item.price
    templateCard.querySelector('button').dataset.id = item.id
    templateCard.querySelector('img').setAttribute('src', item.imageUrl)
    const clone = templateCard.cloneNode(true)
    fragment.appendChild(clone)
  })
  cards.appendChild(fragment)
}