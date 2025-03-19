let works = []; // Variable pour stocker les travaux au niveau global

// Fonction pour récupérer les travaux
const fetchWorks = async () => {
    const response = await fetch("http://localhost:5678/api/works");
    works = await response.json(); // Stocke les travaux récupérés
    return works;
};

// Fonction pour récupérer les catégories
const fetchCategories = async () => {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    return categories;
};

// Fonction pour créer les boutons de catégorie
const createCategoryButtons = (categories) => {
    const buttonContainer = document.querySelector('.filter_buttons'); // Assurez-vous d'avoir cet élément dans votre HTML

    // Créer un bouton "Tous"
    const allButton = document.createElement('button');
    allButton.textContent = 'Tous';
    allButton.addEventListener('click', () => {
        displayWorks(works); // Afficher tous les travaux
        setActiveButton(allButton); // Ajouter classe active au bouton "Tous"
    });
    buttonContainer.appendChild(allButton);

    // Créer un bouton pour chaque catégorie
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category.name;
        button.addEventListener('click', () => {
            filterWorksByCategory(category.id); // Filtrer par catégorie
            setActiveButton(button); // Ajouter classe active au bouton de la catégorie
        });
        buttonContainer.appendChild(button);
    });
};

// Fonction pour activer le bouton sélectionné
const setActiveButton = (activeButton) => {
    const buttons = document.querySelectorAll('.filter_buttons button'); // Sélectionne tous les boutons
    buttons.forEach(button => {
        button.classList.remove('active'); // Supprime la classe "active" des autres boutons
    });
    activeButton.classList.add('active'); // Ajoute la classe "active" au bouton cliqué
};

// Fonction pour filtrer les travaux par catégorie
const filterWorksByCategory = (categoryId) => {
    const filteredWorks = works.filter(work => work.categoryId === categoryId);
    displayWorks(filteredWorks);
};

// Fonction pour afficher les travaux
const displayWorks = (works) => {
    const gallery = document.querySelector('.gallery'); // Assurez-vous d'avoir cet élément dans votre HTML
    gallery.innerHTML = ''; // Réinitialiser la galerie, si nécessaire

    works.forEach(work => {
        const div = document.createElement('figure'); // Créez un conteneur pour chaque projet
        const img = document.createElement('img');
        img.src = work.imageUrl; // L'URL de l'image
        img.alt = work.title; // Texte alternatif pour l'accessibilité
        div.appendChild(img);

        const title = document.createElement('figcaption'); // Titre pour chaque projet
        title.textContent = work.title; // Insérer le titre
        div.appendChild(title);

        gallery.appendChild(div); // Ajoute le conteneur à la galerie
    });
};

// Fonction pour générer la galerie de travaux
async function generateGallery() {
    const works = await fetchWorks();
    console.log(works);
    displayWorks(works);
}

// Fonction pour générer les boutons de filtre par catégorie
async function generateFilterButtons() {
    const categories = await fetchCategories();
    createCategoryButtons(categories);
}

// Appel des fonctions pour générer la galerie et les filtres
generateGallery();
generateFilterButtons();

// Ouvrir la modale
document.getElementById('openModalBtn').onclick = function() {
    showAllImagesInModal(); // Afficher toutes les images dans la modale
    document.getElementById('myModal').style.display = "block";
};

// Fermer la modale
document.querySelector('.close').onclick = function() {
    document.getElementById('myModal').style.display = "none";
};

// Fermer la modale en cliquant en dehors
window.onclick = function(event) {
    if (event.target === document.getElementById('myModal')) {
        document.getElementById('myModal').style.display = "none";
    }
};

// Fonction pour afficher toutes les images dans la modale
const showAllImagesInModal = () => {
    const modalImageContainer = document.querySelector('.img_modal'); // Sélectionne le conteneur d'images de la modale
    modalImageContainer.innerHTML = ''; // Réinitialiser le contenu de la modale

    works.forEach(work => {
        // Crée un conteneur pour chaque image
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container'); // Classe pour styliser le conteneur de l'image

        // Créer l'image
        const img = document.createElement('img');
        img.src = work.imageUrl; // URL de l'image
        img.alt = work.title; // Texte alternatif
        img.classList.add('modal_image'); // Ajouter une classe pour le style si nécessaire

        // Créer l'icône de la poubelle
        const trashIcon = document.createElement('i');
        trashIcon.classList.add('fa-regular', 'fa-trash-can'); // Ajouter les classes de l'icône de la poubelle

        // Ajouter un gestionnaire pour supprimer l'image
        trashIcon.addEventListener('click', () => {
            imageContainer.remove(); // Supprimer l'image quand on clique sur la poubelle
        });

        // Ajouter l'image et l'icône au conteneur
        imageContainer.appendChild(img);
        imageContainer.appendChild(trashIcon);

        // Ajouter le conteneur d'image à la modale
        modalImageContainer.appendChild(imageContainer);
    });
};

// Vérification de l'authentification à la page
document.addEventListener('DOMContentLoaded', function() {
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem('token'); 

    // Sélectionner le lien "Login/Logout" dans le menu
    const loginLogoutLink = document.querySelector('#login-logout-link a'); // Sélectionner le lien <a> directement

    // Vérifier si un token est présent
    if (token) {
        // Si un token est trouvé, modifier le lien pour afficher "Logout"
        loginLogoutLink.innerHTML = 'Logout';
        loginLogoutLink.setAttribute('href', '#'); // Lien sans destination, il ne mène pas à login.html

        // Ajouter un événement pour la déconnexion
        loginLogoutLink.addEventListener('click', function() {
            // Supprimer le token du localStorage pour déconnecter l'utilisateur
            localStorage.removeItem('token');
            window.location.href = 'index.html'; // Rediriger vers la page d'accueil après déconnexion
        });

        // Si connecté, masquer les boutons de filtrage
        const filterButtonsSection = document.querySelector('.filter_buttons');
        if (filterButtonsSection) {
            filterButtonsSection.style.display = 'none'; // Cacher les boutons de filtrage
        }
    
    } else {
        // Si aucun token n'est trouvé, afficher "Login" et permettre la redirection vers login.html
        loginLogoutLink.innerHTML = 'Login';
        loginLogoutLink.setAttribute('href', 'login.html');
    }

    // Afficher ou masquer le mode édition en fonction du token
    const modeEdition = document.querySelector('.mode_edition');
    if (token && modeEdition) {
        modeEdition.style.display = 'flex'; // Afficher le mode édition si connecté
    } else if (modeEdition) {
        modeEdition.style.display = 'none'; // Masquer le mode édition si pas connecté
    }
});

// Fonction de déconnexion
const logoutUser = () => {
    localStorage.removeItem('token'); // Supprimer le token du localStorage
    const modeEdition = document.querySelector('.mode_edition');
    if (modeEdition) {
        modeEdition.style.display = 'none'; // Masquer le mode édition
    }
    window.location.href = 'index.html'; // Rediriger vers la page d'accueil après déconnexion
};

// Ouvrir la seconde modale (pour ajouter une photo)
document.querySelector('.add_photo_btn').addEventListener('click', function() {
    // Cacher la première modale (myModal)
    document.getElementById('myModal').style.display = 'none';
    // Afficher la seconde modale (select-modal)
    document.querySelector('.select-modal').style.display = 'block';
});

// Fermer la seconde modale
document.querySelector('.close-select').addEventListener('click', function() {
    // Cacher la seconde modale
    document.querySelector('.select-modal').style.display = 'none';
    // Réouvrir la première modale
    document.getElementById('myModal').style.display = 'block';
});

// Retour à la première modale (avec la flèche de retour)
document.querySelector('.go-back').addEventListener('click', function() {
    // Cacher la seconde modale
    document.querySelector('.select-modal').style.display = 'none';
    // Réouvrir la première modale
    document.getElementById('myModal').style.display = 'block';
});

// Ajouter une photo avec la seconde modale
document.getElementById('btn-ajout-photo').addEventListener('click', function(){
    // Ouvrir le champ de fichier (input file)
    document.getElementById('fileInput').click();  
});

// Écouter le changement sur l'input de fichier pour récupérer l'image sélectionnée
document.getElementById('fileInput').addEventListener('change', (event) => {
   const file = event.target.files[0];  // Récupérer le fichier sélectionné
   const fileInput = event.target;
   if (file) {
       const reader = new FileReader();

       // Lorsque le fichier est chargé, afficher l'image dans la modale
       reader.onload = function(e) {
           const imageUrl = e.target.result;  // URL de l'image téléchargée
           displayImagePreview(imageUrl);  // Afficher l'image prévisualisée dans la modale
           

       };

       reader.readAsDataURL(file);  // Lire le fichier et obtenir l'URL base64
       fileInput.value='';
   }
});




// Fonction pour afficher l'image prévisualisée dans la modale
function displayImagePreview(imageUrl) {
  /* const imagePreviewContainer = document.querySelector('.ajout-image');  // Conteneur pour l'image dans la modale
   imagePreviewContainer.innerHTML = '';  // Réinitialiser (pour une nouvelle image)*/

    const imageContainer = document.querySelector('.image_container');
    const icon = document.querySelector('.ajout-image i');
    const addButtun = document.getElementById('btn-ajout-photo');
    const infoTexte = document.querySelector('.info-image');

    icon.style.display='none';
    addButtun.style.display='none';
    infoTexte.style.display='none';
    imageContainer.innerHTML = ''; 



   // Créer un élément img pour afficher l'image
   const img = document.createElement('img');
   img.src = imageUrl;  // Définir la source de l'image
   img.alt = 'Image prévisualisée';
   img.classList.add('image-preview');  // Ajouter une classe pour le style si nécessaire

   // Ajouter l'image au conteneur de la modale
   imageContainer.appendChild(img);


   // Active le bouton valider lorsque tous les champs sont remplis
   const validerButton = document.getElementById("valider-modal");
   const titleInput = document.getElementById("title");
   const categoryInput = document.getElementById("category");

   titleInput.addEventListener("input", checkFormValidity);
   categoryInput.addEventListener("change", checkFormValidity);

 

   function checkFormValidity() {
    const title = titleInput.value.trim();
    const category = categoryInput.value;
  
    if (imageUrl && title && category !== "0") {
        validerButton.disabled = false;
    } else {
        validerButton.disabled = true;
    }
}
   // Fonction pour envoyer l'image dans la galerie
   validerButton.addEventListener('click', () => {
       if (titleInput.value.trim() && categoryInput.value !== "0") {
           const newWork = {
               imageUrl,
               title: titleInput.value,
               categoryId: categoryInput.value
           };
           addWorkToGallery(newWork);
           // Fermer la modale et réinitialiser les champs
           document.querySelector('.select-modal').style.display = 'none';
           titleInput.value = '';
           categoryInput.selectedIndex = 0;
           resetAjoutImage()
       }
   });
}

function resetAjoutImage() {
    const imageContainer = document.querySelector('.image_container');
    const icon = document.querySelector('.ajout-image i');
    const addButtun = document.getElementById('btn-ajout-photo');
    const infoTexte = document.querySelector('.info-image');

    imageContainer.innerHTML = ''; 
    icon.style.display='block';
    addButtun.style.display='block';
    infoTexte.style.display='block';
    

}


// Ajouter le travail à la galerie
function addWorkToGallery(work) {
   const gallery = document.querySelector('.gallery');
   const figure = document.createElement('figure');
   const img = document.createElement('img');
   img.src = work.imageUrl;
   img.alt = work.title;
   const caption = document.createElement('figcaption');
   caption.textContent = work.title;

   figure.appendChild(img);
   figure.appendChild(caption);
   gallery.appendChild(figure);

   works.push(work); // Ajouter le nouveau travail à la liste globale works
}
