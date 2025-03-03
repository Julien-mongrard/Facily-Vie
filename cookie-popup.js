document.addEventListener("DOMContentLoaded", function () {
    console.log("📢 [DEBUG] Script cookie-popup.js chargé !");
    if (window.location.pathname.includes("/Recrutement/") || window.location.pathname.includes("/contact/")) {
        updateRecaptchaVisibility();
    }
        const modifyCookiesButton = document.getElementById("modifyCookies");
    if (modifyCookiesButton) {
        modifyCookiesButton.addEventListener("click", function (event) {
            event.preventDefault(); // Empêche le rechargement de la page
            console.log("🔧 [DEBUG] Bouton 'Modifier mes cookies' cliqué !");
            
            // Vérifie si la pop-up des cookies existe
            const modal = document.getElementById("cookieModal");
            if (modal) {
                modal.style.display = "block";
                console.log("✅ [DEBUG] Fenêtre des cookies affichée !");
            } else {
                console.error("❌ [ERREUR] Impossible de trouver 'cookieModal' !");
            }
        });
    } else {
        console.error("❌ [ERREUR] Impossible de trouver le bouton 'Modifier mes cookies' !");
    }
    if (document.getElementById("cookieModal")) return;

    // Création de la pop-up de consentement global
    const globalConsentModal = document.createElement("div");
    globalConsentModal.id = "globalConsentModal";
    globalConsentModal.className = "modal";
    globalConsentModal.style.display = "none";
    globalConsentModal.innerHTML = `
        <div class="modal-content">
            <h2>Consentement global</h2>
            <p>Souhaitez-vous accepter tous les cookies ?</p>
            <button id="acceptAllCookies" class="cookie-button">Tout accepter</button>
            <button id="declineAllCookies" class="cookie-button">Refuser tout</button>
            <button id="chooseCookies" class="cookie-button">Choisir les cookies</button>
        </div>
    `;
    document.body.appendChild(globalConsentModal);

    // Fond semi-transparent pour verrouiller l'arrière-plan
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.style.display = "none";  // Invisible au début
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";  // Fond gris transparent
    document.body.appendChild(overlay);

    // Création de la pop-up de préférences des cookies
    const modal = document.createElement("div");
    modal.id = "cookieModal";
    modal.className = "modal";
    modal.style.display = "none";
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" id="closeModal">&times;</span>
            <h2>Préférences des cookies</h2>
            <p>Gérez vos préférences pour chaque catégorie de cookies :</p>

            <div class="cookie-category">
                <h3>Google reCAPTCHA</h3>
                <p>Le service reCAPTCHA est utilisé pour vérifier que vous n'êtes pas un robot.<br>En acceptant ce service, vous pourrez accéder aux formulaires de contacts / recrutement</p>
                <button id="acceptRecaptcha" class="cookie-button">Accepter</button>
                <button id="refuseRecaptcha" class="cookie-button">Refuser</button>
            </div>

            <div class="cookie-category">
                <h3>Google Analytics</h3>
                <p>Google Analytics est utilisé pour analyser le trafic de notre site.<br>En acceptant ce service, vous nous aidez à améliorer notre site</p>
                <button id="acceptAnalytics" class="cookie-button">Accepter</button>
                <button id="refuseAnalytics" class="cookie-button">Refuser</button>
            </div>

            <button id="savePreferences" class="save-button">Sauvegarder</button>
        </div>
    `;
    document.body.appendChild(modal);

    console.log("Pop-up ajoutée au DOM ✅");

    // Fonction pour gérer les cookies
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(";").shift();
        }
        return null; // 🔥 Ajoute cette ligne pour éviter `undefined`
    }
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = `; expires=${date.toUTCString()}`;
        }
        document.cookie = `${name}=${value}; path=/; SameSite=Lax${expires}`;
        console.log(`Cookie défini : ${name}=${value}`);
    }
    
    

    // Récupérer les boutons de la pop-up de préférences
    const acceptRecaptcha = document.getElementById("acceptRecaptcha");
    const refuseRecaptcha = document.getElementById("refuseRecaptcha");
    const acceptAnalytics = document.getElementById("acceptAnalytics");
    const refuseAnalytics = document.getElementById("refuseAnalytics");
    const saveButton = document.getElementById("savePreferences");

    // Récupérer les boutons de la pop-up de consentement global
    const acceptAllCookies = document.getElementById("acceptAllCookies");
    const declineAllCookies = document.getElementById("declineAllCookies");
    const chooseCookies = document.getElementById("chooseCookies");

    // Initialiser les boutons à gris
    acceptRecaptcha.style.backgroundColor = "#ddd";
    refuseRecaptcha.style.backgroundColor = "#ddd";
    acceptAnalytics.style.backgroundColor = "#ddd";
    refuseAnalytics.style.backgroundColor = "#ddd";

    // Variables pour stocker le choix avant validation
    let recaptchaChoice = getCookie("consentRecaptcha") || "";
    let analyticsChoice = getCookie("consentAnalytics") || "";

    // Si les cookies sont déjà acceptés ou refusés, on n'affiche plus la pop-up globale
    if (recaptchaChoice || analyticsChoice) {
        globalConsentModal.style.display = "none";
    }

    // Initialiser les boutons avec la couleur basée sur les cookies existants
    function updateButtonColors() {
        updateButtonState(acceptRecaptcha, refuseRecaptcha, recaptchaChoice);
        updateButtonState(acceptAnalytics, refuseAnalytics, analyticsChoice);
    }

    function updateButtonState(acceptBtn, refuseBtn, choice) {
        if (choice === "accepted") {
            acceptBtn.style.backgroundColor = "green";
            refuseBtn.style.backgroundColor = "#ddd"; // gris
        } else if (choice === "refused") {
            refuseBtn.style.backgroundColor = "red";
            acceptBtn.style.backgroundColor = "#ddd"; // gris
        } else {
            acceptBtn.style.backgroundColor = "#ddd";
            refuseBtn.style.backgroundColor = "#ddd";
        }
    }

    updateButtonColors();

    // Gestion des boutons (ne change pas la couleur immédiatement)
    acceptRecaptcha.addEventListener("click", () => {
        recaptchaChoice = "accepted";
        updateButtonColors();
    });

    refuseRecaptcha.addEventListener("click", () => {
        recaptchaChoice = "refused";
        updateButtonColors();
    });

    acceptAnalytics.addEventListener("click", () => {
        analyticsChoice = "accepted";
        updateButtonColors();
    });

    refuseAnalytics.addEventListener("click", () => {
        analyticsChoice = "refused";
        updateButtonColors();
    });

    // Sauvegarde des choix, mise à jour des couleurs et fermeture de la pop-up de préférences
    saveButton.addEventListener("click", function () {
        setCookie("consentRecaptcha", recaptchaChoice, 365);
        setCookie("consentAnalytics", analyticsChoice, 365);
        updateButtonColors();
        console.log("Préférences sauvegardées ✅");
        if (window.location.pathname.includes("recrutement.html") || window.location.pathname.includes("contact.html")) {
            updateRecaptchaVisibility();
        }
        
        // Log des options activées
        console.log(`Google reCAPTCHA : ${recaptchaChoice === "accepted" ? "Acceptee" : "Refusee"}`);
        console.log(`Google Analytics : ${analyticsChoice === "accepted" ? "Acceptee" : "Refusee"}`);

        // Fermer la pop-up de préférences après la sauvegarde
        modal.style.display = "none";
        overlay.style.display = "none"; // Retirer le fond gris
        console.log("Pop-up fermée après sauvegarde ✅");
    });

 

    // Clic sur "Tout accepter" ou "Refuser tout"
    acceptAllCookies.addEventListener("click", function () {
        recaptchaChoice = "accepted";
        analyticsChoice = "accepted";
        setCookie("consentRecaptcha", recaptchaChoice, 365);
        setCookie("consentAnalytics", analyticsChoice, 365);
        if (window.location.pathname.includes("recrutement.html") || window.location.pathname.includes("contact.html")) {
            updateRecaptchaVisibility();
        }
        
        updateButtonColors();
        globalConsentModal.style.display = "none"; // Fermer la pop-up globale
        overlay.style.display = "none"; // Retirer le fond gris
        console.log("Tous les cookies ont été acceptés ✅");

        // Log des options activées
        console.log("Google reCAPTCHA : Acceptée");
        console.log("Google Analytics : Acceptée");
    });

    declineAllCookies.addEventListener("click", function () {
        recaptchaChoice = "refused";
        analyticsChoice = "refused";
        setCookie("consentRecaptcha", recaptchaChoice, 365);
        setCookie("consentAnalytics", analyticsChoice, 365);
        updateButtonColors();
        globalConsentModal.style.display = "none"; // Fermer la pop-up globale
        overlay.style.display = "none"; // Retirer le fond gris
        console.log("Tous les cookies ont été refusés ❌");

        // Log des options refusées
        console.log("Google reCAPTCHA : Refusée");
        console.log("Google Analytics : Refusée");
    });

    // Clic sur "Choisir les cookies"
    chooseCookies.addEventListener("click", function () {
        globalConsentModal.style.display = "none"; // Fermer la pop-up globale
        modal.style.display = "block"; // Ouvrir la pop-up des préférences individuelles
        console.log("Clic sur Choisir les cookies ✅");
    });

    // Détection du clic sur "Modifier mes cookies"
    document.addEventListener("click", function (event) {
        if (event.target.id === "modifyCookies") {
            event.preventDefault();
            modal.style.display = "block";
            updateButtonColors();
            console.log("Clic sur Modifier mes cookies ✅");
        }
    });

    // Fermer la pop-up de préférences manuellement
    document.getElementById("closeModal").addEventListener("click", function () {
        modal.style.display = "none";
        console.log("Pop-up fermée ❌");
    });

    // Afficher la pop-up de consentement global au chargement si les choix n'ont pas été enregistrés
    if (!recaptchaChoice && !analyticsChoice) {
        globalConsentModal.style.display = "block";
        overlay.style.display = "block";  // Activer le fond gris pour verrouiller l'arrière-plan
    }
    function updateRecaptchaVisibility() {
        console.log("🔄 [DEBUG] Vérification de l'affichage du formulaire...");
        
        const recaptchaConsent = getCookie("consentRecaptcha");
        console.log("🔎 [DEBUG] Valeur du cookie 'consentRecaptcha' récupérée :", recaptchaConsent);
    
        const recaptchaWarning = document.getElementById("recaptchaWarning");
        const recaptchaButton = document.getElementById("recaptchaButton");
        const submitButton = document.getElementById("submitButton");
    
        if (recaptchaConsent === "accepted") {
            console.log("✅ [DEBUG] Le consentement reCAPTCHA est accepté. Affichage des éléments.");
            recaptchaWarning.style.display = "none"; 
            recaptchaButton.style.display = "block"; 
            submitButton.style.display = "block"; 
        } else if (recaptchaConsent === "refused") {
            console.log("❌ [DEBUG] Consentement reCAPTCHA refusé. Cachage des éléments.");
            recaptchaWarning.style.display = "block"; 
            recaptchaButton.style.display = "none"; 
            submitButton.style.display = "none"; 
        } else {
            console.log("⚠️ [DEBUG] Aucun consentement trouvé. Cachage des éléments.");
            recaptchaWarning.style.display = "block"; 
            recaptchaButton.style.display = "none"; 
            submitButton.style.display = "none"; 
        }
    }
 
});

