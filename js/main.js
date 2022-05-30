const clickBoton = document.querySelectorAll('.button')
const tbody = document.querySelector('.tbody')
let carrito = []

clickBoton.forEach(btn => {
  btn.addEventListener('click', addToCarritoItem)
})

// SWEETALARM
const btnComprar = document.querySelector('.btnComprar')
btnComprar.addEventListener('click', () => {

    Swal.fire({
        title: 'Gracias por su compra!',
        text: 'Le llegará un mail con la confirmación',
        icon: 'success',
        confirmButtonText: 'Finalizar'
})
})

// API DE RECETAS
function receta  () {
  let comida = document.getElementById("searchTerm").value;
  return(comida)
}

let searchButton = document.querySelector(`#search`)

searchButton.addEventListener("click", ()=>{
  sendApiRequest()
})

async function sendApiRequest(){
  let APP_ID = "e8e8c68d";
  let API_KEY = "137df9b64f48b63b8e6d9e2873994d35"
  let response = await fetch(`https://api.edamam.com/search?app_id=${APP_ID}&app_key=${API_KEY}&q=${receta()}`);
  let data = await response.json();
  useApiData (data)
}

function useApiData(data){
  document.querySelector("#contenido").innerHTML = `
  <span class="container-fluid">
  <div class="card container-fluid" style="width: 18rem;">
  <img src="${data.hits[0].recipe.image}" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${data.hits[0].recipe.label}</h5>
    <p class="card-text">${Math.round(data.hits[0].recipe.calories)} calorias</p>
    <a href="${data.hits[0].recipe.url}" target="_blank" class="btn btn-dark">Receta</a>
  </div>
</div>
<div class="card container-fluid" style="width: 18rem;">
  <img src="${data.hits[1].recipe.image}" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${data.hits[1].recipe.label}</h5>
    <p class="card-text">${Math.round(data.hits[1].recipe.calories)} calorias</p>
    <a href="${data.hits[1].recipe.url}" target="_blank" class="btn btn-dark">Receta</a>
  </div>
</div>
<div class="card container-fluid" style="width: 18rem;">
  <img src="${data.hits[2].recipe.image}" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${data.hits[2].recipe.label}</h5>
    <p class="card-text">${Math.round(data.hits[2].recipe.calories)} calorias</p>
    <a href="${data.hits[2].recipe.url}" target="_blank" class="btn btn-dark">Receta</a>
  </div>
</div>
<div class="card container-fluid" style="width: 18rem;">
  <img src="${data.hits[3].recipe.image}" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${data.hits[3].recipe.label}</h5>
    <p class="card-text">${Math.round(data.hits[3].recipe.calories)} calorias</p>
    <a href="${data.hits[3].recipe.url}" target="_blank" class="btn btn-dark">Receta</a>
  </div>
</div>
<div class="card container-fluid" style="width: 18rem;">
  <img src="${data.hits[4].recipe.image}" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${data.hits[2].recipe.label}</h5>
    <p class="card-text">${Math.round(data.hits[4].recipe.calories)} calorias</p>
    <a href="${data.hits[4].recipe.url}" target="_blank" class="btn btn-dark">Receta</a>
  </div>
</div>
</span>
  `
}

//////////////////////////////////////////////////////////////////////////////////////////////
function addToCarritoItem(e){
  const button = e.target
  const item = button.closest('.card')
  const itemTitle = item.querySelector('.card-title').textContent;
  const itemPrice = item.querySelector('.precio').textContent;
  const itemImg = item.querySelector('.card-img-top').src;
  
  const newItem = {
    title: itemTitle,
    precio: itemPrice,
    img: itemImg,
    cantidad: 1
  }

  addItemCarrito(newItem)
}


function addItemCarrito(newItem){

  const alert = document.querySelector('.alert')

  setTimeout( function(){
    alert.classList.add('hide')
  }, 700)
    alert.classList.remove('hide')

  const InputElemnto = tbody.getElementsByClassName('input__elemento')
  for(let i =0; i < carrito.length ; i++){
    if(carrito[i].title.trim() === newItem.title.trim()){
      carrito[i].cantidad ++;
      const inputValue = InputElemnto[i]
      inputValue.value++;
      CarritoTotal()
      return null;
    }
  }
  
  carrito.push(newItem)
  
  renderCarrito()
} 


function renderCarrito(){
  tbody.innerHTML = ''
  carrito.map(item => {
    const tr = document.createElement('tr')
    tr.classList.add('ItemCarrito')
    const Content = `
    
    <th scope="row">1</th>
            <td class="table__productos">
              <img src=${item.img}  alt="">
              <h6 class="title">${item.title}</h6>
            </td>
            <td class="table__price"><p>${item.precio}</p></td>
            <td class="table__cantidad">
              <input type="number" min="1" value=${item.cantidad} class="input__elemento">
              <button class="delete btn btn-danger">x</button>
            </td>
    
    `
    tr.innerHTML = Content;
    tbody.append(tr)

    tr.querySelector(".delete").addEventListener('click', removeItemCarrito)
    tr.querySelector(".input__elemento").addEventListener('change', sumaCantidad)
  })
  CarritoTotal()
}

function CarritoTotal(){
  let Total = 0;
  const itemCartTotal = document.querySelector('.itemCartTotal')
  carrito.forEach((item) => {
    const precio = Number(item.precio.replace("$", ''))
    Total = Total + precio*item.cantidad
  })

  itemCartTotal.innerHTML = `Total $${Total}`
  addLocalStorage()
}

function removeItemCarrito(e){
  const buttonDelete = e.target
  const tr = buttonDelete.closest(".ItemCarrito")
  const title = tr.querySelector('.title').textContent;
  for(let i=0; i<carrito.length ; i++){

    if(carrito[i].title.trim() === title.trim()){
      carrito.splice(i, 1)
    }
  }

  const alert = document.querySelector('.remove')

  setTimeout( function(){
    alert.classList.add('remove')
  }, 700)
    alert.classList.remove('remove')

  tr.remove()
  CarritoTotal()
}

function sumaCantidad(e){
  const sumaInput  = e.target
  const tr = sumaInput.closest(".ItemCarrito")
  const title = tr.querySelector('.title').textContent;
  carrito.forEach(item => {
    if(item.title.trim() === title){
      sumaInput.value < 1 ?  (sumaInput.value = 1) : sumaInput.value;
      item.cantidad = sumaInput.value;
      CarritoTotal()
    }
  })
}

function addLocalStorage(){
  localStorage.setItem('carrito', JSON.stringify(carrito))
}

window.onload = function(){
  const storage = JSON.parse(localStorage.getItem('carrito'));
  if(storage){
    carrito = storage;
    renderCarrito()
  }
}

