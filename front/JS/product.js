// Récupération de l'ID via l'URL //

const url = new URLSearchParams(document.location.search);
const id = url.get("id");
// console.log({id})


//  Récupération des informations des produits via le fetch //
async function displayProduct(){

await fetch("http://localhost:3000/api/products/" + id)

.then(res => res.json())

.then(function(value){


// Récupération et intégration sur la page de l'image //
document.querySelector(".item__img").innerHTML += 

    `<img src= ${value.imageUrl} alt="Photographie d'un canapé">`
    ;

// Récupération et intégration sur la page du titre //
document.getElementById("title").innerHTML +=

    `${value.name}`
    ;

// Récupération et intégration sur la page du prix //
document.getElementById("price").innerHTML +=

    `${value.price}`
    ;

// Récupération et intégration sur la page de la description //
document.getElementById("description").innerHTML +=

    `${value.description}`
    ;

// Boucle pour générer les différentes couleurs en fonction du produit //
for (let color of value.colors){

// Récupération et intégration sur la page des couleur //
document.getElementById("colors").innerHTML +=

    `<option value="${color}">${color}</option>`
    ;
}})}

displayProduct();


// Récupération de la couleur sélectionné par l'utilisateur //
function colorValue() {
    let color = document.getElementById("colors");
    return color.value;
};

// Récupération de la quantité sélectionné par l'utilisateur //
function quantityValue() {
    let quantity = document.getElementById("quantity");
    return quantity.value;
}; 


// Fonction d'ajout de produit dans le localStorage //
const addToLocalStorage = (id, color, quantity) => {

    // Message d'erreur si quantité non sélectionné //
    if (color == "" && quantity == "0") {
        return alert(`Sélectionnez une couleur et une quantité`)
    }

    // Message d'erreur si couleur non sélectionné //
    if (color == "") {
        return alert("Choisissez une couleur");
    }

    // Message d'erreur si quantité sélectionné non comprise entre le minimum et le maximum possible //
    if (quantity <= 0 || quantity >= 41) {
        return alert("Choisissez une quantité entre 1 et 40")
    }

    let productLocalStorage = getCart();

    // Si le panier n'existe pas, création dans un objet dans un tableau // 
    if (productLocalStorage.length == 0) {
        productLocalStorage = [{id: id, color: color, quantity: quantity}];
    
    // Si le panier existe
    } else {
        let found = false;

        // Si l'ID + la couleur du produit existent déjà dans un tableau du panier, ajouter la quantité en plus désiré //
        for (let i = 0; i < productLocalStorage.length; i++) {
            if (id === productLocalStorage[i].id && color === productLocalStorage[i].color) {
                found = true;
                productLocalStorage[i].quantity += quantity;
            }
        }
    
        // Si l'ID + la couleur n'existent pas, création d'un nouvel objet product dans le panier //
        if (found == false) {
            let product = {id: id, color: color, quantity: quantity};
            productLocalStorage.push(product);
        }
    }

    localStorage.setItem(`selectedProduct`, JSON.stringify(productLocalStorage));
    alert("Produit ajouté dans le panier!");

}

// Bouton d'ajout au panier //
const addToCart = document.getElementById("addToCart");

// Lors du click on écoute la couleur et la quantité du produit, et si tout est bon, ajout au panier //
addToCart.addEventListener("click", () => {
    let color = colorValue();
    let quantity = parseInt(quantityValue());
    addToLocalStorage(id, color, quantity);
});