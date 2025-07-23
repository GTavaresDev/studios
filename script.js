const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checKoutBtn = document.getElementById("chekout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("personalise")
const addressWarn = document.getElementById("addres-warn")
const abrirInsta = document.getElementById("abrir-insta")

let cart = [];


// Adicionando o evento de quando clicar em veja meu carrinho vai abrir o display de finalizar a compra 
cartBtn.addEventListener("click", function () {
    updateCartModal()
    cartModal.style.display = "flex"
})

// Adicionando o evento de quando clicar fora vai fechar o evento a cima do carrinho 
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        // Não permite fechar clicando fora
        return;
    }
})

// Adicionando o evento de quando clicar no botão "fechar" vai fechar o carrinho
closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
})

// Adicionando o evento de quando clicar no carrinho ao lado serviço vai adicionar ao carrinho
menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn")
    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        
        // Adiciona no carrinho
        addToCart(name, price)
    }
})


// Função para adicionar no carrinho 
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)
    if (existingItem) {
        // Se o item já existir apenas aumentará +1 unidade
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }
    updateCartModal()
}

// Atualizando o carrinho com os items
function updateCartModal() {
    // Limpa o conteúdo atual do container dos itens do carrinho
    cartItemsContainer.innerHTML = "";

    // Inicializa as variáveis para calcular o total e a quantidade total de itens no carrinho
    let total = 0;
    let totalQuantity = 0;

    // Percorre todos os itens no carrinho
    cart.forEach(item => {
        // Cria um novo elemento div para cada item do carrinho
        const cartItemElement = document.createElement("div");
        // Adiciona classes CSS ao elemento div para estilização
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        // Define o conteúdo HTML do elemento div, incluindo o nome, quantidade e preço do item, e um botão de remoção
        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
            <p class="font-medium">${item.name} </p>
            <p>Qtd: ${item.quantity}</p>
            <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>          
        </div>
        `;

        // Adiciona o preço do item multiplicado pela quantidade ao total geral
        total += item.price * item.quantity;

        // Adiciona a quantidade do item à quantidade total de itens no carrinho
        totalQuantity += item.quantity;

        // Adiciona o elemento div do item do carrinho ao container dos itens do carrinho
        cartItemsContainer.appendChild(cartItemElement);
    });

    // Atualiza o texto do elemento cartTotal para mostrar o total formatado como moeda brasileira
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    // Atualiza o texto do elemento cartCounter para mostrar a quantidade total de itens no carrinho
    cartCounter.innerHTML = totalQuantity;
}


// Função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")
        removeItemCard(name);
    }
    
})
function removeItemCard(name){
    const index = cart.findIndex (item => item.name === name)
    if(index !== -1){
       const item = cart[index]
       if(item.quantity > 1){
        item.quantity -= 1
        updateCartModal()
        return
       }
       cart.splice(index, 1 )
       updateCartModal()
       
    }
} 

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    // Agora se eu escrever algo no personalise a borda vermelha some
    if(inputValue !== "" ){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }



})

//Finalizar pedido
checKoutBtn.addEventListener("click", function(){
    // Verificar se há itens no carrinho
    if (cart.length === 0) {
        alert("Por favor, adicione itens ao carrinho antes de finalizar o pedido!");
        return;
    }

    // Verificar se a forma de pagamento foi selecionada
    const paymentMethod = document.getElementById("personalise").value;
    if (!paymentMethod) {
        document.getElementById("addres-warn").classList.remove("hidden");
        document.getElementById("personalise").classList.add("border-red-500");
        return;
    }

    // Verificar se a data e hora foram selecionadas
    const appointmentDate = document.getElementById("appointment-date").value;
    if (!appointmentDate) {
        document.getElementById("date-warn").classList.remove("hidden");
        document.getElementById("appointment-date").classList.add("border-red-500");
        return;
    }

    // Montar a mensagem com os itens do carrinho
    const cartItems = cart.map((item) => {
        return `Serviço: ${item.name}  \nQuantidade de sessões: ${item.quantity} \nValor: R$${item.price} `;
    }).join("");

    // Obter a data e hora selecionada
    const formattedDate = new Date(appointmentDate).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Codificar a mensagem e o número de telefone
    const phone = "5562991390313";
    const cartMessage = encodeURIComponent(cartItems);
    const formattedDateTime = encodeURIComponent(formattedDate.replace(",", " às"));
    
    const fullMessage = `${cartMessage}%0AForma de pagamento: ${paymentMethod}%20Data e horário desejado: ${formattedDateTime}`;
    
    window.open(`https://wa.me/${phone}?text=${fullMessage}`, "_blank");
    
    // Limpar o carrinho após o pedido ser enviado
    cart = [];
    updateCartModal();
    // Fechar o modal após o envio
    cartModal.style.display = "none";
});

// Adicionar evento para o botão de fechar
closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none";
});

// Adicionar eventos para remover as mensagens de erro quando o usuário começar a preencher
document.getElementById("personalise").addEventListener("change", function() {
    document.getElementById("addres-warn").classList.add("hidden");
    this.classList.remove("border-red-500");
});

document.getElementById("appointment-date").addEventListener("change", function() {
    document.getElementById("date-warn").classList.add("hidden");
    this.classList.remove("border-red-500");
});

//Adicionando verificação se o pedido está sendo feito durante o horario de fucionamento
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    const diaDaSemana = data.getDay(); // 0 (Domingo) a 6 (Sábado)

    // Restringir o horário de segunda a sexta-feira, das 9h às 18h
    const estaAberto = (diaDaSemana >= 1 && diaDaSemana <= 5) && (hora >= 9 && hora < 18);
    
    return estaAberto;
    // True = Estamos aberto
}

//Aqui vai verrificar o horario se não estivermos aberto a tarja vai ficar vermelha
const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen()

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-700")
}else{
    spanItem.classList.remove("bg-green-700")
    spanItem.classList.add("bg-red-500")
}

// Criando o clique do insta 
 abrirInsta.addEventListener("click", function () {
    window.open("https://www.instagram.com/amandaborges.beauty/") 
})
