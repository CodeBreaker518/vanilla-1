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
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

cards.addEventListener('click', e =>{
  // console.log(e)
  addCarrito(e)
})

items.addEventListener('click', e => {
    btnAcciones(e)
})

const btnAcciones = e => {
    if(e.target.classList.contains('btn-success')){
        let product = carrito[e.target.dataset.id]
        product.quantity++
        carrito[e.target.dataset.id] = {...product}
        pintarCarrito()
    }
    if(e.target.classList.contains('btn-danger')){
        let product = carrito[e.target.dataset.id]
        product.quantity--
        if(product.quantity === 0)
        {
            delete carrito[e.target.dataset.id]
        }else{
            carrito[e.target.dataset.id] = {...product}
        }
        pintarCarrito()
    }
    localStorage.setItem('carrito', JSON.stringify(carrito))
    e.stopPropagation()
}


const addCarrito = (e) => {
  if (e.target.classList.contains('btn-dark')){
    setCarrito(e.target.parentElement)
    localStorage.setItem('carrito', JSON.stringify(carrito))
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
  // console.log('carrito',carrito)
  carrito[product.id] = { ...product}
  pintarCarrito()
  // console.log(product, carrito)
}

const pintarCarrito = () => {
  items.innerHTML = ''
  Object.values(carrito).forEach(product => {
    templateCarrito.querySelector('th').textContent = product.id
    templateCarrito.querySelectorAll('td')[0].textContent = product.title
    templateCarrito.querySelectorAll('td')[1].textContent = product.quantity
    templateCarrito.querySelector('span').textContent = product.quantity * product.price

    //add id to buttons
    templateCarrito.querySelector('.btn-success').dataset.id = product.id
    templateCarrito.querySelector('.btn-danger').dataset.id = product.id

    const clone = templateCarrito.cloneNode(true)
    fragment.appendChild(clone)
  })
  items.appendChild(fragment)
  pintarFooter()
}

const pintarFooter = () => {
  footer.innerHTML = ''

  if (Object.keys(carrito).length === 0){
    footer.innerHTML =`
    <th scope="row" colspan="5">Carrito Vacio</th>
    `
    return;
  }
  
  const nCantidad = Object.values(carrito).reduce((acc, {quantity}) => 
    acc + quantity
  , 0)
  const nPrecio = Object.values(carrito).reduce((acc, {quantity, price}) =>
    acc + (quantity * price)
  ,0)
  
  templateFooter.querySelectorAll('td')[0].textContent = nCantidad
  templateFooter.querySelector('span').textContent = nPrecio
  const clone = templateFooter.cloneNode(true)
  fragment.appendChild(clone)
  footer.appendChild(fragment)
  const clearBtn = document.querySelector('#vaciarCarrito')
  clearBtn.addEventListener('click', () =>{
      carrito = {}
      localStorage.setItem('carrito', JSON.stringify(carrito))
      pintarCarrito()
  })
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