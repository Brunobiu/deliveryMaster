const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkountBtn = document.getElementById("checkount-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("vart-count")
const andressInput = document.getElementById("andress")
const addressWarn = document.getElementById("address-warn")


let cart = [];

//Abrir modaldo carrinho
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex"
})

//Fechar modal quando clicar fora
cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

//fechar modal no botao
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})


//Adiconar no carinho
menu.addEventListener("click", function(event){

    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        //Adiconar no carrinho
        addToCart(name, price)

    }



})


//Finção pra adicionar no carinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)   

    if(existingItem){
        existingItem.quantity += 1;
    } else {

        cart.push({
            name,
            price,
            quantity: 1,

            
        })

    }
    Toastify({
        text:  "Adicionado ao Carinho!",
        duration: 5000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "#0c4203",
        },
    }).showToast();

    updateCartModal()
}


//Atualiza do carrinho
function updateCartModal(){
    cartItemContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col", "bg-gray-300");

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
            
                <div>
                    <button class="remove-from-cart-btn" data-name="${item.name}">
                        Remover
                    </button>
                </div>
            </div>
            
        `;




        // Adiciona um ouvinte de evento para remover o item do carrinho
        const removeButton = cartItemElement.querySelector('.remove-from-cart-btn');
        removeButton.addEventListener('click', () => {
            // Remove o item do carrinho
            const itemName = removeButton.getAttribute('data-name');
            const index = cart.findIndex(item => item.name === itemName);
            if (index !== -1) {
                cart.splice(index, 1);
                // Atualiza o modal do carrinho
                updateCartModal();
                // Exibe o Toastify após a remoção do item
                Toastify({
                    text: "Item removido do carrinho!",
                    duration: 4000,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "#b3121d",
                    },
                }).showToast();
            }
        });





        

        total += item.price * item.quantity;

        cartItemContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}



//Funçaõ pra remover item do carrinho
cartItemContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")


        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}



andressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        andressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})


//Finalizar pedido
checkountBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        
        Toastify({
            text: "Estammos fechado no momento!",
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

    if(cart.length === 0) return;
    if(andressInput.value === ""){
        addressWarn.classList.remove("hidden")
        andressInput.classList.add("border-red-500")
    }

    //Enviar o pedodp para api whats
    const cartItems = cart.map((item) => {
        return(
            ` ${item.name} Quantidade: (${item.quantity}) Valor: R$${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "64992580980"
    
    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${andressInput.value}`, "_blank")

    cart = [];
    updateCartModal();

})


// Verificar hora do card
function checkRestaurantOpen(){

    const data = new Date();
    const hora = data.getHours();
    return hora >= 01 && hora < 24;
    //Restaurante esta aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}