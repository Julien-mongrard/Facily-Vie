<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Activer un buffer pour éviter des sorties non désirées
    ob_start();

    // Récupérer la réponse de reCAPTCHA
    $recaptchaResponse = $_POST['g-recaptcha-response'] ?? '';

    // Vérifier la réponse reCAPTCHA via l'API Google
    $secretKey = ''; // Remplace par ta clé secrète
    $verifyURL = 'https://www.google.com/recaptcha/api/siteverify';
    $data = [
        'secret' => $secretKey,
        'response' => $recaptchaResponse
    ];

    $options = [
        'http' => [
            'method' => 'POST',
            'content' => http_build_query($data),
            'header' => "Content-type: application/x-www-form-urlencoded\r\n"
        ]
    ];

    $context = stream_context_create($options);
    $response = file_get_contents($verifyURL, false, $context);
    $responseKeys = json_decode($response, true);

    // Vérifier si reCAPTCHA est validé
    if (intval($responseKeys["success"]) !== 1) {
        // Si reCAPTCHA échoue
        $response = [
            "success" => false,
            "message" => "Erreur de validation reCAPTCHA. Veuillez réessayer."
        ];
        header('Content-Type: application/json');
        echo json_encode($response);
        exit;
    }
    
    // Récupérer les données du formulaire en les sécurisant
    $choix = htmlspecialchars($_POST['choix'] ?? '');
    $nom = htmlspecialchars($_POST['nom'] ?? '');
    $prenom = htmlspecialchars($_POST['prenom'] ?? '');
    $telephone = htmlspecialchars($_POST['telephone'] ?? '');
    $email = htmlspecialchars($_POST['email'] ?? '');
    $message = htmlspecialchars($_POST['message'] ?? '');

    // Préparer les variables de l'email
    $to = ""; // Remplacez par ton e-mail
    $subject = "Prise de Contact - $choix";
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