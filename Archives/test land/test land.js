document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.querySelector("#fileInput");
    const fileList = document.querySelector("#fileList");
    const selectedFiles = [];

    // Gère l'ajout de fichiers
    fileInput.addEventListener("change", () => {
        const files = Array.from(fileInput.files);

        // Ajout des fichiers dans la liste
        files.forEach((file) => {
            selectedFiles.push(file);

            const listItem = document.createElement("li");
            listItem.textContent = file.name;

            // Bouton pour supprimer le fichier
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Supprimer";
            deleteButton.addEventListener("click", () => {
                // Supprime le fichier de la liste
                selectedFiles.splice(selectedFiles.indexOf(file), 1);
                listItem.remove();
            });

            listItem.appendChild(deleteButton);
            fileList.appendChild(listItem);
        });

        // Réinitialise le champ d'input pour pouvoir ajouter le même fichier plusieurs fois
        fileInput.value = "";
    });

    // Gère l'envoi du formulaire
    const form = document.querySelector("#contactForm");
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        // Préparer les données du formulaire
        const formData = new FormData();
        formData.append("nom", document.querySelector("#nom").value);
        formData.append("prenom", document.querySelector("#prenom").value);
        formData.append("email", document.querySelector("#email").value);
        formData.append("telephone", document.querySelector("#telephone").value);
        formData.append("message", document.querySelector("#message").value);

        // Ajouter les fichiers sélectionnés
        selectedFiles.forEach((file, index) => {
            formData.append(`fichiers[]`, file);
        });

    // Envoyer le formulaire via fetch
    fetch("recrutement.php", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
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
    });
});
