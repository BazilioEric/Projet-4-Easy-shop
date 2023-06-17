// Fonction pour récupérer le panier dans le localStorage
const getCart = () => {   
    let productLocalStorage = [];
    if (localStorage.getItem(`selectedProduct`) != null) { 
        productLocalStorage = JSON.parse(localStorage.getItem(`selectedProduct`));
    }
    return productLocalStorage;
}