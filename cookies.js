document.getElementById("accept-cookies").addEventListener("click", function () {
    localStorage.setItem("cookiesAccepted", "true");
    document.getElementById("cookie-banner").style.display = "none";
    document.body.classList.remove("no-scroll"); // Réactiver le fond
    console.log("Cookies acceptés !");
    });

    document.getElementById("reject-cookies").addEventListener("click", function () {
    localStorage.setItem("cookiesAccepted", "false");
    document.getElementById("cookie-banner").style.display = "none";
    document.body.classList.remove("no-scroll"); // Réactiver le fond
    console.log("Cookies refusés !");
    });

    // Vérifie si le consentement a déjà été donné
    window.onload = function () {
    if (!localStorage.getItem("cookiesAccepted")) {
        document.body.classList.add("no-scroll"); // Verrouiller l’arrière-plan
    } else {
        document.getElementById("cookie-banner").style.display = "none";
    }
    };      