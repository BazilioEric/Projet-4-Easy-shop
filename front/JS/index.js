async function displayKanap(){

// Lien pour récupérer la base de données des produits //
await fetch("http://localhost:3000/api/products/")

// Transformation de la réponse en format JSON //
.then(res => res.json())

// Lancement d'une fonction avec la réponse en format JSON //
.then(function(value){

// Déclenchement d'une boucle pour générer autant de produit qu'il y en a // 
    
// for(let i = 0; i < value.length; i++) //
    for (let i in value){
       
// Intégration dans le fichier HTML des éléments bouclés dans des balises HTML //
      document.querySelector(".items").innerHTML += 
        `<a href="./product.html?id=${value[i]._id}">
        <article>
          <img src=${value[i].imageUrl} alt=${value[i].altTxt}>
          <h3 class="productName">${value[i].name}</h3>
          <p class="productColors">${value[i].colors}</p>
          <p class="productDescription">${value[i].description}</p>
          <p class="productPrice">${value[i].price}€</p>
        </article>
        </a>`
      ;}})

      // Fonction qui en cas d'erreur permet d'afficher un message d'erreur dans la console //
.catch(function(error){
    console.log('Il y a un problème avec le fetch : ' + error.message);
}); }

displayKanap();