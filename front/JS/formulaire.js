// REMPLISSAGE DES CHAMPS DU FORMULAIRE //

// Variables pour l'intégration dans le DOM //

const form = document.querySelector('.cart__order__form');
const prenom = document.querySelector('#firstName');
const nom = document.querySelector('#lastName');
const adresse = document.querySelector('#address');
const ville = document.querySelector('#city');
const mail = document.querySelector('#email');

// RegExp pour paramétrer la syntaxe de chaque élément //

const regexNames = new RegExp(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/i);
const addressRegEx = new RegExp (/^[a-zA-Z0-9\s,.'-]{3,}$/);
const emailRegEx = new RegExp ('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');

// Prénom validé ou en erreur //

const validFirstName = function(inputFirstName) {
    let firstNameErrorMsg = document.querySelector('#firstNameErrorMsg');

    if (regexNames.test(inputFirstName.value)) {
        firstNameErrorMsg.innerText = ``;
        return true;
    } else {
        firstNameErrorMsg.innerText = `Veuillez renseigner votre prénom (Les chiffres et les caractères spéciaux ne sont pas autorisés!)!`;
        return false;
    }
}

// Nom validé ou en erreur //
const validLastName = function(inputLastName) {
    let lastNameErrorMsg = document.querySelector('#lastNameErrorMsg');

    if (regexNames.test(inputLastName.value)) {
        lastNameErrorMsg.innerText = ``;
        return true;
    } else {
        lastNameErrorMsg.innerText = `Veuillez renseigner votre nom (Les chiffres et les caractères spéciaux ne sont pas autorisés!)!`;
        return false;
    }
}

// Adresse validé ou en erreur //

const validAddress = function(inputAddress) {
    let addressErrorMsg = document.querySelector('#addressErrorMsg');
    
    if (addressRegEx.test(inputAddress.value)) {
        addressErrorMsg.innerText = ``;
        return true;
    } else {
        addressErrorMsg.innerText = `Veuillez renseigner le numéro et le nom de votre adresse (Les caractères spéciaux ne sont pas autorisés!)!`;
        return false;
    }
}

// Ville validé ou en erreur //

const validCity = function(inputCity) {
    let cityErrorMsg = document.querySelector('#cityErrorMsg');
    
    if (addressRegEx.test(inputCity.value)) {
        cityErrorMsg.innerText = ``;
        return true;
    } else {
        cityErrorMsg.innerText = `Veuillez renseigner le code postal et le nom de votre ville (Les caractères spéciaux ne sont pas autorisés!)!`;
        return false;
    }
}

// Mail validé ou en erreur //

const validEmail = function(inputEmail) {
    let emailErrorMsg = document.querySelector('#emailErrorMsg');

    if (emailRegEx.test(inputEmail.value)) {
        emailErrorMsg.innerText = ``;
        return true;
    } else {
        emailErrorMsg.innerText = `Veuillez renseigner votre adresse e-mail, elle doit contenir "@" et un point!`;
        return false;
    } 
}

// Fonctionnalités permettant l'écoute des inputs //

prenom.addEventListener('change', function() {
    validFirstName(this);
});

nom.addEventListener('change', function() {
    validLastName(this);
});

adresse.addEventListener('change', function() {
    validAddress(this);
});

ville.addEventListener('change', function() {
    validCity(this);
});

mail.addEventListener('change', function() {
    validEmail(this);
});



// SOUMISSION DU FORMULAIRE //

// Ecoute de l'envoi du formulaire //
const postUrl = 'http://localhost:3000/api/products/order/';
form.addEventListener('submit', (e) => {
    e.preventDefault();
    sendForm();
});

// Fonction pour la création de l'objet "contact" et les ID des produits choisis //

const createObjectToSend = () => {

    // Objet "contact" avec les données du formulaire //
    let contact = {
        firstName: prenom.value,
        lastName: nom.value,
        address: adresse.value,
        city: ville.value,
        email: mail.value,
    };
    
    let itemsLocalStorage = getCart();
    let products = [];

    for (i = 0; i < itemsLocalStorage.length; i++) {
        if (products.find((e) => e == itemsLocalStorage[i].id)) {
            console.log('not found');
        } else {
            products.push(itemsLocalStorage[i].id);
        }
    }

    let sendToServ = JSON.stringify({ contact, products });
    return sendToServ;
}

// Fonction d'envoie du formulaire //
const sendForm = () => {
    let itemsLocalStorage = getCart();

    // Erreur si la quantité d'un produit sélectionné est inférieur à ou supérieur à 40 //
    for (i = 0; i < itemsLocalStorage.length; i++) {
        if (itemsLocalStorage[i].qty <= 0 || itemsLocalStorage[i].qty >= 41) {
            return alert(`La quantié d'un article n'est pas comprise entre 1 et 40!`);
        }
    }

    // Erreur si le panier est vide //
    if (itemsLocalStorage.length == 0) {
        return alert(`Votre panier est vide !`);  
    
    // Sinon //
    } else {
        if (validFirstName(prenom) && validLastName(nom) && validAddress(adresse) && validCity(ville) && validEmail(mail)) {
            let sendToServ = createObjectToSend();
            fetch(postUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: sendToServ,
            })
                .then((response) => response.json())
                .then((data) => {
                    localStorage.clear();
                    document.querySelector('.cart__order__form').reset();
                    document.location.href = "confirmation.html?id=" + data.orderId;
                })
                .catch(() => {
                    alert(`Une erreur interne est survenue!`);
                });
        } else {
            return alert(`Veuillez vérifier que tous les champs du formulaire sont correctement rempli.`)
        }
    }
}