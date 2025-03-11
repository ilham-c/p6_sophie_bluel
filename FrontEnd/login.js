document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#contact'); // Assurez-vous que l'ID est correct
    const errorMessageDiv = document.querySelector('#errorMessage'); // Récupère le div d'erreur

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche le rechargement de la page
        const username = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        // Réinitialise le message d'erreur à chaque nouvelle tentative de connexion
        errorMessageDiv.style.display = 'none'; 
        errorMessageDiv.innerText = '';

        login(username, password); // Appel de la fonction de connexion
    });

    // Vérification de l'état de la connexion pour modifier le texte du lien
    const token = localStorage.getItem('token');
    const loginLink = document.querySelector('#loginLink'); // Le lien de connexion dans le menu

    // Vérifie si l'utilisateur est sur la page de login
    if (window.location.pathname.includes("login.html")) {
        // Si tu es sur la page login.html, laisse "Login" dans le lien
        loginLink.textContent = 'Login';
        loginLink.addEventListener('click', () => {
            window.location.href = 'login.html'; // Si l'utilisateur clique sur le lien, il est redirigé vers la page de login
        });
    } else if (token) {
        loginLink.textContent = 'Logout'; // Si connecté, afficher "Logout"
        loginLink.addEventListener('click', logout); // Ajoute un événement pour se déconnecter
    } else {
        loginLink.textContent = 'Login'; // Si non connecté, afficher "Login"
        loginLink.addEventListener('click', () => {
            window.location.href = 'login.html'; // Redirige vers la page de connexion
        });
    }
});

function login(username, password) {
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password: password })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => { throw new Error(error.message || 'Erreur inconnue'); });
        }
        return response.json();
    })
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token); // Stocke le token dans localStorage
            window.location.href = 'index.html'; // Redirige vers la page d'accueil
        } else {
            console.error('Token manquant dans la réponse :', data);
            showError('Erreur : le serveur a répondu sans un token valide.');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);

        // Gestion des erreurs spécifiques (par exemple "invalid credentials")
        if (error.message.includes('invalid credentials')) {
            showError('Nom d\'utilisateur ou mot de passe incorrect.');
        } else {
            showError('Erreur lors de la connexion : ' + error.message);
        }
    });
}

// Fonction pour afficher dynamiquement un message d'erreur dans le div
function showError(message) {
    const errorMessageDiv = document.querySelector('#errorMessage');
    errorMessageDiv.style.display = 'block'; // Affiche le div d'erreur
    errorMessageDiv.innerText = message; // Ajoute le message d'erreur
}

function logout(event) {
    event.preventDefault(); // Empêche le comportement par défaut du lien
    localStorage.removeItem('token'); // Supprime le token du localStorage
    window.location.href = 'index.html'; // Redirige vers la page d'accueil
}
