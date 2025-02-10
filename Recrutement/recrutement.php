<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Activer un buffer pour éviter des sorties non désirées
    ob_start();

    // Récupérer les données du formulaire en les sécurisant
    $choix = htmlspecialchars($_POST['choix'] ?? '');
    $nom = htmlspecialchars($_POST['nom'] ?? '');
    $prenom = htmlspecialchars($_POST['prenom'] ?? '');
    $telephone = htmlspecialchars($_POST['telephone'] ?? '');
    $email = htmlspecialchars($_POST['email'] ?? '');
    $message = htmlspecialchars($_POST['message'] ?? '');

    // Préparer les variables de l'email
    $to = "mongrardjulien@gmail.com"; // Remplacez par votre e-mail de test
    $subject = "Candidature - $choix";
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";

    // Préparer un boundary pour les fichiers joints
    $boundary = md5(time());
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

    // Construire le corps de l'email
    $body = "--$boundary\r\n";
    $body .= "Content-Type: text/plain; charset=\"utf-8\"\r\n";
    $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $body .= "Nom : $nom\nPrénom : $prenom\nTéléphone : $telephone\nEmail : $email\nMessage : $message\r\n\r\n";

    // Traitement des fichiers joints
    if (isset($_FILES['fichiers'])) {
        foreach ($_FILES['fichiers']['tmp_name'] as $key => $tmpName) {
            if ($_FILES['fichiers']['error'][$key] === UPLOAD_ERR_OK) {
                $fileName = $_FILES['fichiers']['name'][$key];
                $fileType = $_FILES['fichiers']['type'][$key];
                $fileContent = chunk_split(base64_encode(file_get_contents($tmpName)));

                // Ajouter le fichier au corps de l'email
                $body .= "--$boundary\r\n";
                $body .= "Content-Type: $fileType; name=\"$fileName\"\r\n";
                $body .= "Content-Transfer-Encoding: base64\r\n";
                $body .= "Content-Disposition: attachment; filename=\"$fileName\"\r\n\r\n";
                $body .= "$fileContent\r\n";
            }
        }
    }

    // Fin du message
    $body .= "--$boundary--";

    // Envoyer l'email et préparer la réponse JSON
    $success = mail($to, $subject, $body, $headers);
    $response = [
        "success" => $success,
        "message" => $success ? "Message envoyé avec succès." : "Erreur lors de l'envoi du message. Veuillez réessayer."
    ];

    // Supprimer les sorties non désirées
    ob_end_clean();

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
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}
