function envoyerFormulaire(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    const form = document.querySelector("#contactForm");
    const formData = new FormData(form);

    // Afficher le message "En cours..." et l'arrière-plan
    const statusMessage = document.querySelector("#statusMessage");
    const overlay = document.querySelector("#overlay");

    statusMessage.style.display = "block";
    overlay.style.display = "block";
    statusMessage.textContent = "⏳ Envoi en cours...";

    // Envoyer le formulaire via fetch
    fetch("recrutement.php", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        // Afficher le score reCAPTCHA dans la console
        if (data.recaptcha_score !== undefined) {
            console.log("Score reCAPTCHA: ", data.recaptcha_score);
        }

        if (data.success) {
            statusMessage.textContent = "✅ Message envoyé avec succès !";
            form.reset(); // Réinitialiser les champs du formulaire
        } else {
            statusMessage.textContent = "❌ " + data.message;
        }
    })
    .catch(error => {
        statusMessage.textContent = "❌ Une erreur s'est produite : " + error.message;
    })
    .finally(() => {
        setTimeout(() => {
            statusMessage.style.display = "none"; // Masquer le message
            overlay.style.display = "none"; // Masquer l'arrière-plan
        }, 5000); // Disparaît après 5 secondes
    });
}

document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêcher l'envoi classique du formulaire
    
    // Créer un FormData pour envoyer les données du formulaire
    var formData = new FormData(this);
    
    // Envoyer la requête AJAX
    fetch('ton_script_php.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Si l'envoi a réussi
        if (data.success) {
            alert(data.message); // Afficher le message de succès
            // Réinitialiser le reCAPTCHA
            grecaptcha.reset(); // Cette fonction réinitialise le reCAPTCHA
        } else {
            alert(data.message); // Afficher le message d'erreur
        }
    })
    .catch(error => {
        alert("Erreur lors de l'envoi. Veuillez réessayer.");
    });
});
