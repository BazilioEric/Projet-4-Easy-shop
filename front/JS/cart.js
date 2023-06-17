// Si il existe, récupérer le panier avec les infos des produits //
async function retrieveCart() {

    let itemsLocalStorage = getCart();
    let quantityTotal = 0;
    let priceTotal = 0;

    if (localStorage.getItem(`selectedProduct`) != null) {
        for (let i = 0; i < itemsLocalStorage.length; i++) {
            let id = itemsLocalStorage[i].id;
            let color = itemsLocalStorage[i].color;
            let sectionCart = document.querySelector(`#cart__items`);
            let apiUrl = 'http://localhost:3000/api/products/' + id;

            // Récupération des produits à afficher avec un fetch //
            const response = await fetch(apiUrl);

            // Si erreur avec la récupération d'un élément, affichage d'un message d'erreur //
            if (!response.ok) {
                let productError = `<article class="cart__item">
                <p>Oups ! Il y a eu une erreur lors de la récupération d'un élément du panier ! :(</p> </article>`;
            
                const parser = new DOMParser();
                const displayErrorProductItems = parser.parseFromString(productError, "text/html");

                sectionCart.appendChild(displayErrorProductItems.body.firstChild);

            // Affichage des produits du panier avec changement de quantité disponible par produit, et supression par produit //    
            } else {
                const data = await response.json();
                const parser = new DOMParser();
                    let detailProductItems = 
                    `<article class="cart__item" data-id="${id}" data-color="${color}">
                            <div class="cart__item__img">
                                <img src="${data.imageUrl}" alt="${data.altTxt}">
                            </div>
                            
                            <div class="cart__item__content">
                                <div class="cart__item__content__description">
                                    <h2>${data.name}</h2>
                                    <p>Couleur : ${color}</p>
                                    <p data-id="price-${id}-${color}">Prix : ${data.price} €</p>
                                </div>
                                
                                <div class="cart__item__content__settings">
                                    <div class="cart__item__content__settings__quantity">
                                        <p>Qté : </p>
                                        <input type="number" class="itemQuantity" name="itemQuantity" onchange="changeQty('${id}', '${color}', '${data.price}', this.value)" min="1" max="100" value="${itemsLocalStorage[i].quantity}">
                                    </div>
                                
                                    <div class="cart__item__content__settings__delete">
                                        <p class="deleteItem" onclick="deleteItem('${id}', '${color}', '${data.price}')">Supprimer</p>
                                    </div>
                                </div>
                            </div>
                        </article>`;

                        const displayDetailProductItems = parser.parseFromString(detailProductItems, "text/html");
                        sectionCart.appendChild(displayDetailProductItems.body.firstChild);

                    // Affichage du prix total //
                    priceTotal += data.price * itemsLocalStorage[i].quantity;
                    document.querySelector('#totalPrice').innerHTML = priceTotal;

                    // Affichage de la quantité totale //
                    quantityTotal += parseInt(itemsLocalStorage[i].quantity);
                    document.querySelector('#totalQuantity').innerHTML = quantityTotal;

            }
        
        }

    // Si panier vide affichage d'un message //

    } else {
        document.querySelector(`h1`).innerText = `Votre panier est vide ! `;
        document.querySelector('#totalQuantity').innerText = `0`;
        document.querySelector('#totalPrice').innerText = `0`;
    }
}

// Changement de la quantité par article //

const changeQty = (id, color, price, newQty) => {
    let itemsLocalStorage = getCart();
    let item = itemsLocalStorage.find(
        (itemsLocalStorage) => 
            id === itemsLocalStorage.id && color === itemsLocalStorage.color
    );

    // Changer la quantité dans le localStorage //
    let previousQty = item.quantity;
    let newQuantity = parseInt(newQty);

    item.quantity = newQuantity;
    localStorage.setItem(`selectedProduct`, JSON.stringify(itemsLocalStorage));

    // Alerte si la quantité est inférieur à 1 ou supérieur à 50 //
    if (newQty <= 0 || newQty >= 51) {
        alert(`La quantité d'un produit doit être entre 1 et 50!`)
    }

    // Changer la quantité totale //
    let totalQtyBefore = parseInt(document.querySelector(`#totalQuantity`).innerHTML);
    let totalQtyAfter = totalQtyBefore - previousQty + newQuantity;

    document.querySelector(`#totalQuantity`).innerHTML = totalQtyAfter;

    // Changer le prix total //
    let priceItem = parseInt(price);

    let totalPriceBefore = parseInt(document.querySelector(`#totalPrice`).innerHTML);
    let totalPriceAfter = totalPriceBefore - (priceItem * previousQty) + (priceItem * newQuantity);

    document.querySelector(`#totalPrice`).innerHTML = totalPriceAfter;
}

// Supression entière d'un article //
const deleteItem = (id, color, price) => {
    let itemsLocalStorage = getCart();
    for(i = 0; i < itemsLocalStorage.length; i++) {
        if (id === itemsLocalStorage[i].id & color === itemsLocalStorage[i].color) {
            let qtyToDelete = itemsLocalStorage[i].quantity;
            itemsLocalStorage.splice(i, 1);

            let itemToDelete = document.querySelector(`.cart__item[data-id="${id}"][data-color="${color}"]`);
            itemToDelete.setAttribute("style", "display:none");

            localStorage.setItem(`selectedProduct`, JSON.stringify(itemsLocalStorage));

            // Changer la quantité totale //
            let totalQtyBefore = parseInt(document.querySelector(`#totalQuantity`).innerHTML);
            let totalQtyAfter = totalQtyBefore - qtyToDelete;

            document.querySelector(`#totalQuantity`).innerHTML = totalQtyAfter;

            // Changer le prix total //
            let priceItem = parseInt(price);
            let totalPriceBefore = parseInt(document.querySelector(`#totalPrice`).innerHTML);
            let totalPriceAfter = totalPriceBefore - (priceItem * qtyToDelete);

            document.querySelector(`#totalPrice`).innerHTML = totalPriceAfter;

            if (itemsLocalStorage.length == 0) {
                document.querySelector(`h1`).innerHTML = `Votre panier est vide!`;
                return alert(`Votre panier est vide!`);
            }
        }
    }
}

retrieveCart();

