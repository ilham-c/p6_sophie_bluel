document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#contact'); // Assurez-vous que l'ID est correct
    loginForm.addEventListener('submit', function(event) { // Changement ici : écoutez l'événement 'submit'
        event.preventDefault(); // Empêche le rechargement de la page
        const username = document.querySelector('#email').value; // Assurez-vous que c'est l'ID correct
        const password = document.querySelector('#password').value; // Changement de 'name' à 'password'
        login(username, password); // Appelez la fonction pour initier la connexion
    });
});

function login(username, password) {
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password:password})
    })
    .then(response => {
        if (!response.ok) {
            // Renvoyer une erreur pour le traitement ci-dessous
            



            return response.json().then(error => { throw new Error(error.message); });
        }
        return response.json(); // Récupérer les données si la réponse est correcte
    })
    .then(data => {
        // Vérifiez que le token est présent dans les données reçues
        if (data.token) {
            sessionStorage.setItem('token', data.token);
            window.location.href = 'index.html'; // Redirigez vers la page souhaitée
        } else {
            // Avertir que le token n'est pas présent
            console.error('Token manquant dans la réponse :', data);
            alert('Erreur : le serveur a répondu sans un token valide.'); // Message d'erreur plus convivial
        }
    })
    
    .catch(error => {
        // Affichez un message d'erreur à l'utilisateur
        console.error('Erreur:', error);
        alert('Erreur lors de la connexion : ' + error.message);
    });

}

