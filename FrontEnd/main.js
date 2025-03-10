let works = []; // Variable pour stocker les travaux au niveau global

const fetchWorks = async () => {
    const reponse = await fetch("http://localhost:5678/api/works");
    works = await reponse.json(); // Stocke les travaux récupérés
    return works;
    //fetchCategories(); // Récupérer les catégories après les travaux//
    //displayWorks(works); // Afficher tous les travaux au début//
};

const fetchCategories = async () => {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    return categories;
    //createCategoryButtons(categories); // Créez les boutons à partir des catégories récupérées//  
};

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

const setActiveButton = (activeButton) => {
    const buttons = document.querySelectorAll('.filter_buttons button'); // Sélectionne tous les boutons
    buttons.forEach(button => {
        button.classList.remove('active'); // Supprime la classe "active" des autres boutons
    });
    activeButton.classList.add('active'); // Ajoute la classe "active" au bouton cliqué
};

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


async function generateGallery(){
    const works= await fetchWorks()
    console.log(works)
    displayWorks(works)

}
generateGallery()
async function generateFilterButtons(){
    const categories= await fetchCategories()
    createCategoryButtons(categories)
}
generateFilterButtons()


// Ouvrir la modale
document.getElementById('openModalBtn').onclick = function() {
    document.getElementById('myModal').style.display = "block";
  }
  
  // Fermer la modale
  document.querySelector('.close').onclick = function() {
    document.getElementById('myModal').style.display = "none";
  }
  
  // Fermer la modale en cliquant en dehors
  window.onclick = function(event) {
    if (event.target === document.getElementById('myModal')) {
      document.getElementById('myModal').style.display = "none";
    }
  }
  
  // Gestion de l'envoi du formulaire
  document.getElementById('projectForm').onsubmit = function(e) {
    e.preventDefault();
    // Ajoutez votre logique pour envoyer les données à l'API ici
  };


 
// Afficher toutes les images dans la modale
const showAllImagesInModal = () => {
    const modalImageContainer = document.querySelector('.img_modal'); // Sélectionnez le conteneur d'images de la modale
    modalImageContainer.innerHTML = ''; // Réinitialiser le contenu de la modale

    works.forEach(work => {
        const img = document.createElement('img'); // Créez un élément image
        img.src = work.imageUrl; // Définissez l'URL de l'image
        img.alt = work.title; // Texte alternatif
        img.classList.add('modal_image'); // Ajouter une classe pour le style si nécessaire
        modalImageContainer.appendChild(img); // Ajoutez l'image au conteneur de la modale 

              // Créez un conteneur pour chaque image et l'icône
              const imageContainer = document.createElement('div');
              imageContainer.classList.add('image-container'); // Classe pour styliser le conteneur de l'image
      
      
              // Créez l'icône de la poubelle
              const trashIcon = document.createElement('i');
              trashIcon.classList.add('fa-regular', 'fa-trash-can'); // Ajouter les classes de l'icône de la poubelle
      
              // Vous pouvez ajouter un gestionnaire d'événements pour supprimer l'image si nécessaire
              trashIcon.addEventListener('click', () => {
                  imageContainer.remove(); // Supprimer l'image et l'icône quand on clique sur la poubelle
              });
      
              // Ajouter l'image et l'icône au conteneur
              imageContainer.appendChild(img);
              imageContainer.appendChild(trashIcon);
      
              // Ajouter le conteneur de l'image à la modale
              modalImageContainer.appendChild(imageContainer);

    });


};

document.getElementById('openModalBtn').onclick = function() {
    showAllImagesInModal(); // Appel de la fonction pour afficher les images
    document.getElementById('myModal').style.display = "block";
}
