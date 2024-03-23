const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const chekcoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

//Abrir modal carrinho
cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex";
});

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

// Fechar o modal quando clicar no botao fechar
closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    //Adicionar no carrinho
    addToCart(name, price);
  }
});

// Função para adicionar o carrinho
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    //Se o item ja existe, aumenta a quantidade
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }
  
  updateCartModal();

  Toastify({
    text: `Item adicionado ao carrinho`,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    style: {
      background: "#4CAF50",
    },
  }).showToast();
}

// Atualiza carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
         <div>
          <p class="font-bold">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2">R$: ${item.price.toFixed(2)}</p>
         </div>

    
        <button class="bg-red-500 p-1 rounded text-white font-medium remove-from-cart-btn" data-name="${
          item.name
        }">
        Remover
        </button>
         
        </div>
        `;
    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.innerHTML = cart.length;
}

// Função para remover item do carrinho
cartItemsContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-from-cart-btn")) {
    const name = e.target.getAttribute("data-name");
    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }
    cart.splice(index, 1);
    updateCartModal();
  }
}

addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    addressWarn.classList.add("hidden");
    addressInput.classList.remove("border-red-500");
  }
});

// Finalizar Pedido
chekcoutBtn.addEventListener("click", function () {

    const isOpen = checkRestaurantOpen();
    if(!isOpen) {
      
      Toastify({
        text: "Opa, o restaurante está fechado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#ef4444",
        },
      }).showToast();
        return;
    }

  if (cart.length === 0) return;
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }


  //Enviar pedido para o whats
  const cartItems = cart.map(item => {
    return (
      ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price.toFixed(2)} \n`
    )
  }).join("");

  const message = encodeURIComponent("========================= \n *Itens do Pedido* =========================" + cartItems)
  const phone = '79999652159'

  window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank" )

  cart = [];
  updateCartModal()
});

//Verificar a hora e manipular o card horário
function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 22; // True
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if(isOpen) {
   spanItem.classList.remove("bg-red-500") 
   spanItem.classList.add("bg-green-600") 
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500") 
}
