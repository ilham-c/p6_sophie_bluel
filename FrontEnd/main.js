//window onload pour charger la page completer de toute la gallery
window.addEventListener("load", (event) => {
    console.log("La page est complètement chargée");
});


let works = []; // Variable pour stocker les travaux au niveau global
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const validerButton = document.getElementById("valider-modal");

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
  const buttonContainer = document.querySelector(".filter_buttons"); // Assurez-vous d'avoir cet élément dans votre HTML

  // Créer un bouton "Tous"
  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.addEventListener("click", () => {
    displayWorks(works); // Afficher tous les travaux
    setActiveButton(allButton); // Ajouter classe active au bouton "Tous"
  });
  buttonContainer.appendChild(allButton);

  // Créer un bouton pour chaque catégorie
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.addEventListener("click", () => {
      filterWorksByCategory(category.id); // Filtrer par catégorie
      setActiveButton(button); // Ajouter classe active au bouton de la catégorie
    });
    buttonContainer.appendChild(button);
  });
};

// Fonction pour activer le bouton sélectionné
const setActiveButton = (activeButton) => {
  const buttons = document.querySelectorAll(".filter_buttons button"); // Sélectionne tous les boutons
  buttons.forEach((button) => {
    button.classList.remove("active"); // Supprime la classe "active" des autres boutons
  });
  activeButton.classList.add("active"); // Ajoute la classe "active" au bouton cliqué
};

// Fonction pour filtrer les travaux par catégorie
const filterWorksByCategory = (categoryId) => {
  const filteredWorks = works.filter((work) => work.categoryId === categoryId);
  displayWorks(filteredWorks);
};

let imageUrl;
// Fonction pour afficher les travaux
const displayWorks = (works) => {
  const gallery = document.querySelector(".gallery"); // Assurez-vous d'avoir cet élément dans votre HTML
  gallery.innerHTML = ""; // Réinitialiser la galerie, si nécessaire

  works.forEach((work) => {
    const div = document.createElement("figure"); // Créez un conteneur pour chaque projet
    const img = document.createElement("img");
    imageUrl = work.imageUrl;
    img.src = imageUrl; // L'URL de l'image
    img.alt = work.title; // Texte alternatif pour l'accessibilité
    div.appendChild(img);

    const title = document.createElement("figcaption"); // Titre pour chaque projet
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
document.getElementById("openModalBtn").onclick = function () {
  showAllImagesInModal(); // Afficher toutes les images dans la modale
  document.getElementById("myModal").style.display = "block";
};

// Fermer la modale
document.querySelector(".close").onclick = function () {
  document.getElementById("myModal").style.display = "none";
};

// Fermer la modale en cliquant en dehors
window.onclick = function (event) {
  if (event.target === document.getElementById("myModal")) {
    document.getElementById("myModal").style.display = "none";
  }
};

// Fonction pour afficher toutes les images dans la modale
const showAllImagesInModal = () => {
  const modalImageContainer = document.querySelector(".img_modal"); // Sélectionne le conteneur d'images de la modale
  modalImageContainer.innerHTML = ""; // Réinitialiser le contenu de la modale

  works.forEach((work) => {
    // Crée un conteneur pour chaque image
    const imageContainer = document.createElement("figure");
    imageContainer.dataset.id=work.id;
    imageContainer.classList.add("image-container"); // Classe pour styliser le conteneur de l'image

    // Créer l'image
    const img = document.createElement("img");
    img.src = work.imageUrl; // URL de l'image
    img.alt = work.title; // Texte alternatif
    img.classList.add("modal_image"); // Ajouter une classe pour le style si nécessaire

    // Créer l'icône de la poubelle
    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-regular", "fa-trash-can"); // Ajouter les classes de l'icône de la poubelle

    // Ajouter un gestionnaire pour supprimer l'image
     trashIcon.addEventListener("click", async(e) => {
     await deleteImg(e);
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
document.addEventListener("DOMContentLoaded", function () {
  // Récupérer le token depuis le localStorage
  const token = localStorage.getItem("token");

  // Sélectionner le lien "Login/Logout" dans le menu
  const loginLogoutLink = document.querySelector("#login-logout-link a"); // Sélectionner le lien <a> directement

  // Vérifier si un token est présent
  if (token) {
    // Si un token est trouvé, modifier le lien pour afficher "Logout"
    loginLogoutLink.innerHTML = "Logout";
    loginLogoutLink.setAttribute("href", "#"); // Lien sans destination, il ne mène pas à login.html

    // Ajouter un événement pour la déconnexion
    loginLogoutLink.addEventListener("click", function () {
      // Supprimer le token du localStorage pour déconnecter l'utilisateur
      localStorage.removeItem("token");
      window.location.href = "index.html"; // Rediriger vers la page d'accueil après déconnexion
    });

    // Si connecté, masquer les boutons de filtrage
    const filterButtonsSection = document.querySelector(".filter_buttons");
    if (filterButtonsSection) {
      filterButtonsSection.style.display = "none"; // Cacher les boutons de filtrage
    }
  } else {
    // Si aucun token n'est trouvé, afficher "Login" et permettre la redirection vers login.html
    loginLogoutLink.innerHTML = "Login";
    loginLogoutLink.setAttribute("href", "login.html");
  }

  // Afficher ou masquer le mode édition en fonction du token
  const modeEdition = document.querySelector(".mode_edition");
  if (token && modeEdition) {
    modeEdition.style.display = "flex"; // Afficher le mode édition si connecté
  } else if (modeEdition) {
    modeEdition.style.display = "none"; // Masquer le mode édition si pas connecté
  }
  // Afficher ou masquer la div "modif" en fonction du token
  const modifDiv = document.querySelector(".modif");
  if (modifDiv) {
    if (token) {
      modifDiv.style.display = "block"; // Afficher la div si connecté
    } else {
      modifDiv.style.display = "none"; // Cacher la div si déconnecté
    }
  }
});

// Fonction de déconnexion
const logoutUser = () => {
  localStorage.removeItem("token"); // Supprimer le token du localStorage
  const modeEdition = document.querySelector(".mode_edition");
  if (modeEdition) {
    modeEdition.style.display = "none"; // Masquer le mode édition
  }
  const modifDiv = document.querySelector(".modif");
  if (modifDiv) {
    modifDiv.style.display = "none"; // Masquer la div "modif"
  }
  window.location.href = "index.html"; // Rediriger vers la page d'accueil après déconnexion
};

// Ouvrir la seconde modale (pour ajouter une photo)
document.querySelector(".add_photo_btn").addEventListener("click", function () {
  // Cacher la première modale (myModal)
  document.getElementById("myModal").style.display = "none";
  // Afficher la seconde modale (select-modal)
  document.querySelector(".select-modal").style.display = "block";
});

// Fermer la seconde modale
document.querySelector(".close-select").addEventListener("click", function () {
  // Cacher la seconde modale
  document.querySelector(".select-modal").style.display = "none";
  // Réouvrir la première modale
  document.getElementById("myModal").style.display = "block";
});

// Retour à la première modale (avec la flèche de retour)
document.querySelector(".go-back").addEventListener("click", function () {
  // Cacher la seconde modale
  document.querySelector(".select-modal").style.display = "none";
  // Réouvrir la première modale
  document.getElementById("myModal").style.display = "block";
});

// Ajouter une photo avec la seconde modale
document
  .getElementById("btn-ajout-photo")
  .addEventListener("click", function () {
    // Ouvrir le champ de fichier (input file)
    document.getElementById("fileInput").click();
  });

document.getElementById("fileInput").addEventListener("change", (event) => {
  const fileInput = event.target;
  const file = fileInput.files[0]; // Récupérer le fichier sélectionné

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      displayImagePreview(e.target.result);
    };

    reader.readAsDataURL(file);
  }
});

// Fonction pour afficher l'image prévisualisée
function displayImagePreview(imageUrl) {
  const imageContainer = document.querySelector(".image_container");
  const icon = document.querySelector(".ajout-image i");
  const addButton = document.getElementById("btn-ajout-photo");
  const infoText = document.querySelector(".info-image");

  // Masquer les éléments d'ajout
  icon.style.display = "none";
  addButton.style.display = "none";
  infoText.style.display = "none";

  // Remplacer l'image précédente par la nouvelle
  imageContainer.innerHTML = "";
  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = "Image prévisualisée";
  img.classList.add("image-preview");
  imageContainer.appendChild(img);

  // Activer le bouton Valider si tous les champs sont remplis
  
  
 

 
  
  titleInput.addEventListener("input", checkFormValidity);
  categoryInput.addEventListener("change", checkFormValidity);
}

function checkFormValidity() {
    if (imageUrl && titleInput.value.trim() && categoryInput.value !== "0") {
      validerButton.disabled = false;
    } else {
      validerButton.disabled = true;
    }
  }

// Fonction pour réinitialiser l'input file après validation
function resetFileInput() {
  const fileInput = document.getElementById("fileInput");
  fileInput.value = ""; // Réinitialisation simple qui fonctionne
}

// Ajout d'une image validée à la galerie et réinitialisation
document.getElementById("valider-modal").addEventListener("click", () => {
  const imageContainer = document.querySelector(".image_container");
  const image = imageContainer.querySelector("img");
  const titleInput = document.getElementById("title");
  const categoryInput = document.getElementById("category");

  if (image && titleInput.value.trim() && categoryInput.value !== "0") {
    const newWork = {
      imageUrl: image.src,
      title: titleInput.value,
      categoryId: categoryInput.value,
    };
    addWorkToGallery(newWork);
    document.querySelector('.select-modal').style.display='none';

    // Réinitialiser les champs
    titleInput.value = "";
    categoryInput.selectedIndex = 0;

    // Réinitialiser l'input file ici après validation
    resetFileInput();

    // Réinitialiser l'affichage
    resetAjoutImage();
  }
});

// Fonction pour le rechargement de la page //
async function uploadWork(imageFile, title, categoryId) {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("title", title);
  formData.append("category", categoryId);

  try {
      const response = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`, 
          },
          body: formData, 
      });

      if (!response.ok) {
          throw new Error("Échec de l’envoi de l’image");
      }

      await response.json(); 
      await generateGallery(); // Rafraîchir la galerie avec les données mises à jour

  } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
  }
}



// Fonction pour restaurer l'UI après l'ajout d'une image
function resetAjoutImage() {
  const imageContainer = document.querySelector(".image_container");
  const icon = document.querySelector(".ajout-image i");
  const addButton = document.getElementById("btn-ajout-photo");
  const infoText = document.querySelector(".info-image");

  imageContainer.innerHTML = ""; // Supprime l'image affichée
  icon.style.display = "block";
  addButton.style.display = "block";
  infoText.style.display = "block";
}

// Ajouter l'image validée à la galerie
function addWorkToGallery(work) {
  const gallery = document.querySelector(".gallery");
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;
  const caption = document.createElement("figcaption");
  caption.textContent = work.title;

  figure.appendChild(img);
  figure.appendChild(caption);
  gallery.appendChild(figure);
  works.push(work);
}

// Fonction pour la suppression des travaux //

async function deleteImg(e) {
  e.preventDefault();

  const token = localStorage.getItem('token');
  if (!token) {
     return;
  }

  const imageId = e.target.closest('figure').dataset.id; //recupère la balise html figure avec donnée id
  if (!imageId) {
      return;
  }

  try {
      await fetch(`http://localhost:5678/api/works/${imageId}`, {
          method: 'DELETE',
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      await generateGallery()
  }
    
  catch(e){console.log(e)}
  
}

