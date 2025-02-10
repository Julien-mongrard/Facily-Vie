<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupérer les données
    $choix = htmlspecialchars($_POST['choix']);
    $nom = htmlspecialchars($_POST['nom']);
    $prenom = htmlspecialchars($_POST['prenom']);
    $telephone = htmlspecialchars($_POST['telephone']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    $to = "mongrardjulien@gmail.com"; // Remplacez par votre e-mail de test
    $subject = "Prise de contact - $choix";
    $body = "
    Nom : $nom
    Prénom : $prenom
    Téléphone : $telephone
    Email : $email
    Message : $message
    ";

    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";

    // Envoyer l'email et préparer la réponse JSON
    if (mail($to, $subject, $body, $headers)) {
        $response = [
            "success" => true,
            "message" => "Message envoyé avec succès."
        ];
    } else {
        $response = [
            "success" => false,
            "message" => "Erreur lors de l'envoi du message. Veuillez réessayer."
        ];
    }

    // Renvoyer la réponse au format JSON
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
} else {
    // Méthode non autorisée
    $response = [
        "success" => false,
        "message" => "Méthode non autorisée."
    ];

    // Renvoyer la réponse au format JSON
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}
