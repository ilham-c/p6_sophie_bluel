//window onload pour charger la page completer de toute la gallery
window.addEventListener("load", (event) => {
  console.log("La page est complètement chargée");
});


let works = []; // Variable pour stocker les travaux au niveau global//
let selectedFile = null;
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const validerButton = document.getElementById("valider-modal");

// Fonction pour récupérer les travaux //
const fetchWorks = async () => {
const response = await fetch("http://localhost:5678/api/works");
works = await response.json(); 
return works;
};

// Fonction pour récupérer les catégories //
const fetchCategories = async () => {
const response = await fetch("http://localhost:5678/api/categories");
const categories = await response.json();
return categories;
};

// Fonction pour créer les boutons de catégorie //
const createCategoryButtons = (categories) => {
const buttonContainer = document.querySelector(".filter_buttons");

// Créer un bouton "Tous" //
const allButton = document.createElement("button");
allButton.textContent = "Tous";
allButton.addEventListener("click", () => {
  displayWorks(works); 
  setActiveButton(allButton);
});
buttonContainer.appendChild(allButton);

// Créer un bouton pour chaque catégorie //
categories.forEach((category) => {
  const button = document.createElement("button");
  button.textContent = category.name;
  button.addEventListener("click", () => {
    filterWorksByCategory(category.id); 
    setActiveButton(button);
  });
  buttonContainer.appendChild(button);
});
};

// Fonction pour activer le bouton sélectionné //
const setActiveButton = (activeButton) => {
const buttons = document.querySelectorAll(".filter_buttons button"); 
buttons.forEach((button) => {
  button.classList.remove("active");
});
activeButton.classList.add("active");
};

// Fonction pour filtrer les travaux par catégorie //
const filterWorksByCategory = (categoryId) => {
const filteredWorks = works.filter((work) => work.categoryId === categoryId);
displayWorks(filteredWorks);
};

let imageUrl;
// Fonction pour afficher les travaux //
const displayWorks = (works) => {
const gallery = document.querySelector(".gallery"); 
gallery.innerHTML = ""; 

works.forEach((work) => {
  const div = document.createElement("figure"); 
  const img = document.createElement("img");
  imageUrl = work.imageUrl;
  img.src = imageUrl;
  img.alt = work.title; 
  div.appendChild(img);

  const title = document.createElement("figcaption");
  title.textContent = work.title;
  div.appendChild(title);

  gallery.appendChild(div);
});
};

// Fonction pour générer la galerie de travaux //
async function generateGallery() {
const works = await fetchWorks();
console.log(works);
displayWorks(works);
}

// Fonction pour générer les boutons de filtre par catégorie //
async function generateFilterButtons() {
const categories = await fetchCategories();
createCategoryButtons(categories);
}

// Appel des fonctions pour générer la galerie et les filtres //
generateGallery();
generateFilterButtons();

// Ouvrir la modale //
document.querySelector(".mode_edition").onclick = function () {
  showAllImagesInModal();
  document.getElementById("myModal").style.display = "block";
};
document.querySelector(".modif").onclick = function () {
  showAllImagesInModal();
  document.getElementById("myModal").style.display = "block";
}

// Fermer la modale //
document.querySelector(".close").onclick = function () {
document.getElementById("myModal").style.display = "none";
};

// Fermer la modale en cliquant en dehors //
window.onclick = function (event) {
if (event.target === document.getElementById("myModal")) {
  document.getElementById("myModal").style.display = "none";
}
};

// Fonction pour afficher toutes les images dans la modale //
const showAllImagesInModal = () => {
const modalImageContainer = document.querySelector(".img_modal");
modalImageContainer.innerHTML = ""; 

works.forEach((work) => {
  // Crée un conteneur pour chaque image //
  const imageContainer = document.createElement("figure");
  imageContainer.dataset.id=work.id;
  imageContainer.classList.add("image-container");

  // Créer l'image //
  const img = document.createElement("img");
  img.src = work.imageUrl; 
  img.alt = work.title; 
  img.classList.add("modal_image");

  // Créer l'icône de la poubelle //
  const trashIcon = document.createElement("i");
  trashIcon.classList.add("fa-regular", "fa-trash-can");

  // Ajouter un gestionnaire pour supprimer l'image //
   trashIcon.addEventListener("click", async(e) => {
   await deleteImg(e);
   imageContainer.remove();
   });

  // Ajouter l'image et l'icône au conteneur //
  imageContainer.appendChild(img);
  imageContainer.appendChild(trashIcon);

  // Ajouter le conteneur d'image à la modale //
  modalImageContainer.appendChild(imageContainer);
});
};

// Vérification de l'authentification à la page //
document.addEventListener("DOMContentLoaded", function () {
// Récupérer le token depuis le localStorage
const token = localStorage.getItem("token");

// Sélectionner le lien "Login/Logout" dans le menu //
const loginLogoutLink = document.querySelector("#login-logout-link a");

// Vérifier si un token est présent //
if (token) {
  // Si un token est trouvé, modifier le lien pour afficher "Logout" //
  loginLogoutLink.innerHTML = "Logout";
  loginLogoutLink.setAttribute("href", "#");

  // Ajouter un événement pour la déconnexion //
  loginLogoutLink.addEventListener("click", function () {
    // Supprimer le token du localStorage pour déconnecter l'utilisateur //
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });

  // Si connecté, masquer les boutons de filtrage //
  const filterButtonsSection = document.querySelector(".filter_buttons");
  if (filterButtonsSection) {
    filterButtonsSection.style.display = "none";
  }
} else {
  // Si aucun token n'est trouvé, afficher "Login" et permettre la redirection vers login.html //
  loginLogoutLink.innerHTML = "Login";
  loginLogoutLink.setAttribute("href", "login.html");
}

// Afficher ou masquer le mode édition en fonction du token //
const modeEdition = document.querySelector(".mode_edition");
if (token && modeEdition) {
  modeEdition.style.display = "flex";
} else if (modeEdition) {
  modeEdition.style.display = "none";
}
// Afficher ou masquer la div "modif" en fonction du token //
const modifDiv = document.querySelector(".modif");
if (modifDiv) {
  if (token) {
    modifDiv.style.display = "block";
  } else {
    modifDiv.style.display = "none";
  }
}
});

// Fonction de déconnexion //
const logoutUser = () => {
localStorage.removeItem("token");
const modeEdition = document.querySelector(".mode_edition");
if (modeEdition) {
  modeEdition.style.display = "none";
}
const modifDiv = document.querySelector(".modif");
if (modifDiv) {
  modifDiv.style.display = "none";
}
window.location.href = "index.html";
};

// Ouvrir la seconde modale (pour ajouter une photo) //
document.querySelector(".add_photo_btn").addEventListener("click", function () {
// Cacher la première modale (myModal) //
document.getElementById("myModal").style.display = "none";
// Afficher la seconde modale (select-modal) //
document.querySelector(".select-modal").style.display = "block";
});

// Fermer la seconde modale //
document.querySelector(".close-select").addEventListener("click", function () {
// Cacher la seconde modale //
document.querySelector(".select-modal").style.display = "none";
// Réouvrir la première modale //
document.getElementById("myModal").style.display = "block";
});

// Retour à la première modale (avec la flèche de retour) //
document.querySelector(".go-back").addEventListener("click", function () {
// Cacher la seconde modale //
document.querySelector(".select-modal").style.display = "none";
// Réouvrir la première modale //
document.getElementById("myModal").style.display = "block";
});

// Ajouter une photo avec la seconde modale //
document
.getElementById("btn-ajout-photo")
.addEventListener("click", function () {
  // Ouvrir le champ de fichier (input file) //
  document.getElementById("fileInput").click();
});

document.getElementById("fileInput").addEventListener("change", (event) => {
const fileInput = event.target;
const file = fileInput.files[0]; é

if (file) {
  selectedFile = file ; 

  const reader = new FileReader();

  reader.onload = function (e) {
    displayImagePreview(e.target.result);
  };

  reader.readAsDataURL(file);
}
});

// Fonction pour afficher l'image prévisualisée //
function displayImagePreview(imageUrl) {
const imageContainer = document.querySelector(".image_container");
const icon = document.querySelector(".ajout-image i");
const addButton = document.getElementById("btn-ajout-photo");
const infoText = document.querySelector(".info-image");

// Masquer les éléments d'ajout // 
icon.style.display = "none";
addButton.style.display = "none";
infoText.style.display = "none";

// Remplacer l'image précédente par la nouvelle //
imageContainer.innerHTML = "";
const img = document.createElement("img");
img.src = imageUrl;
img.alt = "Image prévisualisée";
img.classList.add("image-preview");
imageContainer.appendChild(img);

// Activer le bouton Valider si tous les champs sont remplis //
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

// Fonction pour réinitialiser l'input file après validation //
function resetFileInput() {
const fileInput = document.getElementById("fileInput");
fileInput.value = ""; // Réinitialisation simple qui fonctionne
}

// Ajout d'une image validée à la galerie et réinitialisation //
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

  // Appel ici la fonction uploadWork avec le fichier  //
  uploadWork(selectedFile, titleInput.value.trim(),  categoryInput.value);
  document.querySelector('.select-modal').style.display='none';

  // Réinitialiser les champs //
  titleInput.value = "";
  categoryInput.selectedIndex = 0;

  // Réinitialiser l'input file ici après validation // 
  resetFileInput();

  // Réinitialiser l'affichage // 
  resetAjoutImage();

  // Réinitialiser selectedFile //
  selectedFile = null;
}
});

// Fonction pour le rechargement de la page //
async function uploadWork(imageFile, title, categoryId) {
  console.log("test");
  console.log("image : ", imageFile)
  console.log("title : ", title)
  console.log("category : ", categoryId)
  let formData = new FormData();
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
    await generateGallery(); 

} catch (error) {
    console.error("Erreur lors de l'ajout :", error);
}
}



// Fonction pour restaurer l'UI après l'ajout d'une image //
function resetAjoutImage() {
const imageContainer = document.querySelector(".image_container");
const icon = document.querySelector(".ajout-image i");
const addButton = document.getElementById("btn-ajout-photo");
const infoText = document.querySelector(".info-image");

imageContainer.innerHTML = ""; 
icon.style.display = "block";
addButton.style.display = "block";
infoText.style.display = "block";
}

// Ajouter l'image validée à la galerie //
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

const imageId = e.target.closest('figure').dataset.id;
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