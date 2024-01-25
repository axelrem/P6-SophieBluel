let listWorks = [];
let isUserAdmin;
const apiWorks = 'http://localhost:5678/api/works';
const apiCategories = 'http://localhost:5678/api/categories';
const apiDeleteWorks = 'http://localhost:5678/api/works/';

// 1. si token present localStorage = bandeau noir + bouton logout + bouton modifier
// 2. bouton logout, retirer cle token 
// 3. modales

function getCategories() {
    fetch(apiCategories, { method: "GET", headers: { "Content-Type": "application/json" } })
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
    fetch(apiWorks, { method: "GET", headers: { "Content-Type": "application/json" } })
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
    btnModif.addEventListener("click", function() {
        openModalEdition(listWorks);
    });
    btnModif.style.display ="flex";
    
}

// Partie modale --

function openModalEdition(works) {
    // fenetre modal + creer elements (boucle for) + footer ajout photo
    const modal = document.querySelector(".modal");

    modal.innerHTML = `
        <div class="modal-wrapper js-modal-stop">
            <span class="close-modal" onclick="closeModal()">&times;</span>
            <div class="modal-content">
                <span class="title-modal">Galerie photo</span>
                <div class="gallery-modal"></div>
                <div class="container-btn">
                <button id="btn-modal">Ajouter une photo</button>
                </div>
            </div>
        </div>
    `;

    const galleryModal = document.querySelector(".gallery-modal");

    for (let i = 0; i < works.length; i++) {
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        image.src = works[i].imageUrl;
        image.alt = works[i].title;
        image.id = "photo-" + works[i].id;

        const trash = document.createElement("i");
        trash.classList.add("fa-solid", "fa-trash-can");
        const bgTrash = document.createElement("div");
        bgTrash.classList.add("bg-trash");
        trash.addEventListener("click", function(event) {
            event.stopPropagation();
            deletePhoto(works[i].id);
        });

        galleryModal.appendChild(figure);
        figure.appendChild(image);
        figure.appendChild(trash);
        figure.appendChild(bgTrash);
        
    }

    const btnModal = document.getElementById("btn-modal");
    btnModal.addEventListener("click", function() {
        addPhoto();
    });

    modal.style.display = "flex";
}

function closeModal() {
        const modal = document.querySelector(".modal");
        const photoModal = document.querySelector(".add-photo-modal");
        modal.style.display = "none";
        photoModal.style.display = "none";
    }

        document.addEventListener("click", function(event) {
            const modal = document.querySelector(".modal");
        
            if (event.target === modal && !event.target.classList.contains("fa-trash-can")) {
                closeModal();
            }});

        document.addEventListener("click", function(event) {
            const photoModal = document.querySelector(".add-photo-modal");

            if (event.target === photoModal && !event.target.classList.contains("fa-trash-can")) {
                closeModal();
            }});

function addPhoto() {
    // appel api
    // bouton valider gris tant que tout n'est pas rempli

    const photoModal = document.querySelector(".add-photo-modal");

    photoModal.innerHTML =`
        <div class="modal-wrapper js-modal-stop">
            <i class="fa-solid fa-arrow-left"></i>
            <span class="close-modal" onclick="closeModal()">&times;</span>
            <div class="modal-content">
                <span class="title-modal">Ajout photo</span>
                <div class="container-photo">
            <form class="formulaire">
                <div class= "container-add">
                    <svg width="76" height="76" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M63.5517 15.8879C64.7228 15.8879 65.681 16.8461 65.681 18.0172V60.5768L65.0156 59.7118L46.9165 36.2894C46.3176
                    35.5042 45.3727 35.0517 44.3879 35.0517C43.4031 35.0517 42.4715 35.5042 41.8594 36.2894L30.8136 50.5824L26.7546 44.8998C26.1557 
                    44.0614 25.1975 43.569 24.1595 43.569C23.1214 43.569 22.1632 44.0614 21.5644 44.9131L10.9178 59.8183L10.319 60.6434V60.6034V18.0172C10.319
                    16.8461 11.2772 15.8879 12.4483 15.8879H63.5517ZM12.4483 9.5C7.75048 9.5 3.93103 13.3195 3.93103 18.0172V60.6034C3.93103 65.3012 7.75048
                    69.1207 12.4483 69.1207H63.5517C68.2495 69.1207 72.069 65.3012 72.069 60.6034V18.0172C72.069 13.3195 68.2495 9.5 63.5517 9.5H12.4483ZM23.0948
                    35.0517C23.9337 35.0517 24.7644 34.8865 25.5394 34.5655C26.3144 34.2444 27.0186 33.7739 27.6118 33.1807C28.2049 32.5876 28.6755 31.8834 28.9965 
                    31.1083C29.3175 30.3333 29.4828 29.5027 29.4828 28.6638C29.4828 27.8249 29.3175 26.9943 28.9965 26.2192C28.6755 25.4442 28.2049 24.74 27.6118 
                    24.1468C27.0186 23.5537 26.3144 23.0831 25.5394 22.7621C24.7644 22.4411 23.9337 22.2759 23.0948 22.2759C22.2559 22.2759 21.4253 22.4411 20.6503 
                    22.7621C19.8752 23.0831 19.171 23.5537 18.5779 24.1468C17.9847 24.74 17.5142 25.4442 17.1931 26.2192C16.8721 26.9943 16.7069 27.8249 16.7069 
                    28.6638C16.7069 29.5027 16.8721 30.3333 17.1931 31.1083C17.5142 31.8834 17.9847 32.5876 18.5779 33.1807C19.171 33.7739 19.8752 34.2444 20.6503 
                    34.5655C21.4253 34.8865 22.2559 35.0517 23.0948 35.0517Z" fill="#B9C5CC"/>
                    </svg>
                    <input type="file" accept="image/png, image/jpg" id="fileInput" class="btn-add-photo" style="display: none;">
                    <label for="fileInput" class="custom-label">+ Ajouter photo</label>
                    <img id="photoPreview" class="photo-preview hidden" src="#"/>
                    <p class="txt-add">jpg, png : 4mo max</p>
                </div>

                <div class="container-title">
                    <label for="text">Titre</label>
                    <input type="text" class="title">
                </div>

                <div class="container-categorie">
                    <label for="text">Catégorie</label>
                    <select class="categorie">
                    <option value="" selected disabled></option>
                    </select>
                </div>
                </div>
                    <button id="btn-add-modal" type="submit" disabled>Valider</button>
                </div>
            <form>
        </div>
        `;

        const fileInput = document.getElementById("fileInput");
        const photoPreview = document.getElementById("photoPreview");
        const hiddenFile = document.querySelector(".custom-label");
        const hiddenTxt = document.querySelector(".txt-add");
        const titleInput = document.querySelector(".title");
        const categorieInput = document.querySelector(".categorie");
        const validateButton = document.getElementById("btn-add-modal");


        // Récupérer la liste des catégories depuis l'API
        fetch(apiCategories, { method: "GET", headers: {'Authorization': `Bearer ${window.localStorage.getItem("token")}`} })
        .then(response => response.json())
        .then(categories => {
            // Effacez toutes les options existantes
        categorieInput.innerHTML = "";

        // Ajoutez une option vide (sélectionnez une catégorie) en premier
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.text = "Sélectionnez une catégorie";
            categorieInput.appendChild(defaultOption);
            // Mettre à jour la liste déroulante des catégories avec les données de l'API
            categories.forEach(category => {
                const option = document.createElement("option");
                option.value = category.id;
                option.textContent = category.name;
                categorieInput.appendChild(option);
            });
        })

        fileInput.addEventListener("input", function () {
            const file = fileInput.files[0];

            if (file) {
                // Mettez à jour la source de l'image pour afficher la prévisualisation
                const reader = new FileReader();

                reader.onload = function (e) {
                    photoPreview.src = e.target.result;
                };

                reader.readAsDataURL(file);

                photoPreview.classList.remove("hidden");
                hiddenFile.classList.add("hidden");
                hiddenTxt.classList.add("hidden");
            } else {
                // Réinitialisez la source de l'image si aucun fichier n'est sélectionné
                photoPreview.src = "#";

                photoPreview.classList.add("hidden");
                hiddenFile.classList.remove("hidden");
                hiddenTxt.classList.remove("hidden");
            }

            updateButtonState();
        });

        titleInput.addEventListener("input", function () {
            updateButtonState();
        });
    
        categorieInput.addEventListener("change", function () {
            updateButtonState();
        });

        updateButtonState();

        function updateButtonState() {
            const file = fileInput.files[0];
            const title = titleInput.value.trim();
            const categorie = categorieInput.value;

            if (file && title !== "" && categorie !== "") {
                validateButton.removeAttribute("disabled");
            } else {
                validateButton.setAttribute("disabled", true);  
            }
        }

        photoModal.style.display = "flex";

        const backArrow = document.querySelector(".fa-arrow-left");
        backArrow.addEventListener("click", function() {
            backToMainModal();
        });

        const btnModalPhoto = document.getElementById("btn-add-modal");
        btnModalPhoto.addEventListener("click", function () {
        // Appeler la fonction pour ajouter une photo avec les données nécessaires
        submitPhoto();
    });
}


function submitPhoto() {
    const fileInput = document.getElementById("fileInput");
    const titleInput = document.querySelector(".title");
    const categorieInput = document.querySelector(".categorie");
    const btnModalPhoto = document.getElementById("btn-add-modal");
    

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);
    formData.append("title", titleInput.value.trim());
    formData.append("category", categorieInput.value.trim());

    fetch(apiWorks, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("token")}`
        },
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        // Ajouter la nouvelle photo à la liste des travaux côté client
        listWorks.push(data);
        // Mettre à jour l'UI pour afficher la nouvelle photo
        displayWorks(listWorks);
        closeModal();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function backToMainModal() {
    const modal = document.querySelector(".modal");
    const photoModal = document.querySelector(".add-photo-modal");

    photoModal.style.display = "none";
    modal.style.display = "flex";
}

function deletePhoto(idPhoto) {
    // Appel de l'API pour supprimer la photo
    fetch(apiDeleteWorks + idPhoto, { 
        method: "DELETE",
        headers: {'Authorization': `Bearer ${window.localStorage.getItem("token")}`
    } })
    .then(response => {

        if (response.status === 204) {
            // Mettre à jour la liste des travaux côté client après la suppression
            listWorks = listWorks.filter((item) => item.id !== idPhoto);
            
            // Mettre à jour l'UI
            displayWorks(listWorks);
            openModalEdition(listWorks);
        }
    });
}



function logOut() {
    //revenir a la page de base ou page de login
    window.location.href = "login.html";
    //supprimer le localstorage
    window.localStorage.removeItem("token");
}