<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nom = htmlspecialchars($_POST['nom']);
    $prenom = htmlspecialchars($_POST['prenom']);
    $telephone = htmlspecialchars($_POST['telephone']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    // Préparer les pièces jointes
    $boundary = md5(time());
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

    $body = "--$boundary\r\n";
    $body .= "Content-Type: text/plain; charset=\"utf-8\"\r\n\r\n";
    $body .= "Nom: $nom\nPrénom: $prenom\nEmail: $email\nMessage:\n$message\n";

    if (isset($_FILES['fichiers'])) {
        foreach ($_FILES['fichiers']['tmp_name'] as $key => $tmpName) {
            if ($_FILES['fichiers']['error'][$key] === UPLOAD_ERR_OK) {
                $fileName = $_FILES['fichiers']['name'][$key];
                $fileData = chunk_split(base64_encode(file_get_contents($tmpName)));
                $body .= "--$boundary\r\n";
                $body .= "Content-Type: application/octet-stream; name=\"$fileName\"\r\n";
                $body .= "Content-Transfer-Encoding: base64\r\n";
                $body .= "Content-Disposition: attachment; filename=\"$fileName\"\r\n\r\n";
                $body .= "$fileData\r\n";
            }
        }
    }

    $body .= "--$boundary--";

    $to = "mongrardjulien@gmail.com";
    $subject = "Contact Form Submission";
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
}