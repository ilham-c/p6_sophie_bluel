document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#contact'); 
    const errorMessageDiv = document.querySelector('#errorMessage'); 

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        // Réinitialise le message d'erreur à chaque nouvelle tentative de connexion //
        errorMessageDiv.style.display = 'none'; 
        errorMessageDiv.innerText = '';

        login(username, password); 
    });

    // Vérification de l'état de la connexion pour modifier le texte du lien //
    const token = localStorage.getItem('token');
    const loginLink = document.querySelector('#loginLink');

    // Vérifie si l'utilisateur est sur la page de login //
    if (window.location.pathname.includes("login.html")) {
       
        loginLink.textContent = 'Login';
        loginLink.addEventListener('click', () => {
            window.location.href = 'login.html'; 
        });
    } else if (token) {
        loginLink.textContent = 'Logout'; 
        loginLink.addEventListener('click', logout); 
    } else {
        loginLink.textContent = 'Login'; 
        loginLink.addEventListener('click', () => {
            window.location.href = 'login.html';
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
            localStorage.setItem('token', data.token);
            window.location.href = 'index.html';
        } else {
            console.error('Token manquant dans la réponse :', data);
            showError('Erreur : le serveur a répondu sans un token valide.');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);

       
        if (error.message.includes('invalid credentials')) {
            showError('Nom d\'utilisateur ou mot de passe incorrect.');
        } else {
            showError('Les identifiants sont incorrects' );
        }
    });
}

// Fonction pour afficher dynamiquement un message d'erreur dans le div // 
function showError(message) {
    const errorMessageDiv = document.querySelector('#errorMessage');
    errorMessageDiv.style.display = 'block'; 
    errorMessageDiv.innerText = message;
}

function logout(event) {
    event.preventDefault();
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}
