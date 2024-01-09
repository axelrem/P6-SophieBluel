let listWorks = [];
let isUserAdmin;


// 1. si token present localStorage = bandeau noir + bouton logout + bouton modifier
// 2. bouton logout, retirer cle token 
// 3. modales

function getCategories() {
    fetch('http://localhost:5678/api/categories', { method: "GET", headers: { "Content-Type": "application/json" } })
        .then(response => response.json())
        .then(json => {

            const listCategories = json;
            const sectionFilters = document.querySelector(".filters");
            
            const btnReset = document.createElement("button");
            btnReset.innerText = "Tous";
            sectionFilters.appendChild(btnReset);
            

            btnReset.addEventListener('click', function () {
                resetFilters();
            })

            for (let i = 0; i < listCategories.length; i++) {
                const btnFilter = document.createElement("button");
                btnFilter.innerText = listCategories[i].name;
                sectionFilters.appendChild(btnFilter);

                btnFilter.addEventListener('click', function () {
                    filterWorksByCategory(listCategories[i].id);
                })
            }
        });
}

function getWorks() {
    fetch('http://localhost:5678/api/works', { method: "GET", headers: { "Content-Type": "application/json" } })
        .then(response => response.json())
        .then(json => {

            listWorks = json;
            const sectionGallery = document.querySelector(".gallery");
            
            displayWorks(listWorks);
        });
}

function displayWorks(works) {
    const sectionGallery = document.querySelector(".gallery");
    sectionGallery.innerHTML = '';

    for (let i = 0; i < works.length; i++) {
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        image.src = works[i].imageUrl;
        image.alt = works[i].title;
        image.id = "photo-" + works[i].id;
        const caption = document.createElement("figcaption");
        caption.innerText = works[i].title;

        sectionGallery.appendChild(figure);
        figure.appendChild(image);
        figure.appendChild(caption);
    }
}

function resetFilters() {
    displayWorks(listWorks);
}

function filterWorksByCategory(categoryId) {
    const filteredWorks = listWorks.filter(work => work.categoryId === categoryId);
    displayWorks(filteredWorks);
}

getWorks();
getCategories();

// Partie login --

document.addEventListener("DOMContentLoaded", function() {
    // Appel à checkToken une fois que le document est complètement chargé
    checkToken();
});

function checkToken() {
    if(window.localStorage.getItem("token")) {
        isUserAdmin = true;
        handleAdminElem();
    } else {
        isUserAdmin = false;
    }
}

function handleAdminElem() {
    // mode edition
    const editionMode = document.querySelector(".edition-mode");
    editionMode.innerHTML = '<div class="edition-txt"><i class="fa-regular fa-pen-to-square"></i><p>Mode édition</p></div>';
    editionMode.style.display = "flex";

    // bouton logout/suppression bouton login
    const headerLogin = document.querySelector(".header-login");
    headerLogin.innerText = "logout";
    headerLogin.addEventListener("click", logOut);
    
    
    // bouton modifier
    const btnModif = document.querySelector(".btn-mod");
    btnModif.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> <span>modifier</span>';
    btnModif.addEventListener("click", openModalEdition);
    btnModif.style.display ="flex";
    
}




// Partie modale --

function openModalEdition() {
    // fenetre modal + creer elements (boucle for) + footer ajout photo
    const modal = document.querySelector(".modal");

    modal.innerHTML = `
        <div class="modal-wrapper">
            <span class="close-modal">&times;</span>
            <div class="modal-content">
                <span class="title-modal">Galerie photo</span>
                <div class="gallery-modal"></div>
                <button class="btn-modal">Ajouter une photo</button>
            </div>
        </div>
    `;

    modal.style.display = "flex";
}

function addPhoto() {
    // appel api
    // bouton valider gris tant que tout n'est pas rempli
}

function deleteWorks(idPhoto) {
    document.getElementById("photo- " + idPhoto)

    if (elementToRemove) {
        elementToRemove.remove();
    }
}

function deletePhoto() {
    // appel api
    // supprime photo dans modal et accueil
    // modifier getWorks
    // SANS ACTUALISER LA PAGE
}

function logOut() {
    //revenir a la page de base ou page de login
    window.location.href = "login.html";
    //supprimer le localstorage
    window.localStorage.removeItem("token");
}