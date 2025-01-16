document.addEventListener("DOMContentLoaded", () => {
    const imageUrl = "https://i.postimg.cc/Gp79YPZF/CV-2025-01-16-Amine-Siouane-TM.png";
    document.getElementById("displayed-image").src = imageUrl;

    // Liste des images pour l'effet de curseur
    const cursorImages = [
        "https://fr.louisvuitton.com/content/dam/lv/online/high-end/unisex/collection/red/Cursor_Red.html/jcr:content//assets/flowers/Flower-01.png",
        "https://fr.louisvuitton.com/content/dam/lv/online/high-end/unisex/collection/red/Cursor_Red.html/jcr:content//assets/flowers/Flower-02.png",
        "https://fr.louisvuitton.com/content/dam/lv/online/high-end/unisex/collection/red/Cursor_Red.html/jcr:content//assets/flowers/Flower-03.png",
        "https://fr.louisvuitton.com/content/dam/lv/online/high-end/unisex/collection/red/Cursor_Red.html/jcr:content//assets/flowers/Flower-04.png",
        "https://fr.louisvuitton.com/content/dam/lv/online/high-end/unisex/collection/red/Cursor_Red.html/jcr:content//assets/flowers/Flower-05.png",
        "https://i.pinimg.com/originals/46/ae/3f/46ae3fd45fb59aae5bdb775eccd3ee07.png"
    ];

    let lastMoveTime = 0;  // Variable pour contrôler le délai entre les apparitions
    const delay = 50; // Délai entre les images en ms (réduit la fréquence d'apparition)
    const positions = []; // Liste pour stocker les positions des images existantes

    // Fonction pour vérifier si une nouvelle position entre en collision avec une image existante
    function isPositionCollision(x, y, size) {
        for (let i = 0; i < positions.length; i++) {
            const pos = positions[i];
            const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
            if (distance < size + pos.size) {
                return true;  // Si la distance est trop faible, collision détectée
            }
        }
        return false;
    }

    // Fonction pour générer l'apparition aléatoire d'une image autour du curseur
    function createCursorImage(x, y) {
        const cursorIndex = Math.floor(Math.random() * cursorImages.length);  // Sélection aléatoire d'image
        const imageUrl = cursorImages[cursorIndex];

        // Générer un nouvel élément image autour du curseur
        const cursorImage = document.createElement("img");
        cursorImage.src = imageUrl;
        cursorImage.classList.add("cursor-image");

        // Générer une taille aléatoire entre 10px et 100px
        const size = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
        cursorImage.style.width = `${size}px`;
        cursorImage.style.height = `${size}px`;

        // Tentative de positionnement aléatoire jusqu'à ce qu'il n'y ait pas de collision
        let offsetX, offsetY;
        let attempts = 0;
        do {
            offsetX = Math.floor(Math.random() * 150) - 75;  // Décalage horizontal aléatoire
            offsetY = Math.floor(Math.random() * 150) - 75;  // Décalage vertical aléatoire
            // Calculer la position sur la page
            x = x + offsetX;
            y = y + offsetY;
            attempts++;
            if (attempts > 100) break;  // Limite les tentatives pour éviter une boucle infinie
        } while (isPositionCollision(x, y, size)); // Vérifier si la position entre en collision

        // Positionner l'image à une distance suffisante autour du curseur
        cursorImage.style.left = `${x}px`;
        cursorImage.style.top = `${y}px`;

        // Calculer un mouvement aléatoire (direction et distance)
        const moveX = Math.floor(Math.random() * 200) - 100; // Déplacement horizontal
        const moveY = Math.floor(Math.random() * 200) - 100; // Déplacement vertical

        cursorImage.style.setProperty('--move-x', `${moveX}px`);
        cursorImage.style.setProperty('--move-y', `${moveY}px`);

        // Ajouter l'image au body
        document.body.appendChild(cursorImage);

        // Ajouter la position et la taille à la liste pour les vérifications futures
        positions.push({ x: x, y: y, size: size });

        // Supprimer l'image après 3s (temps de déplacement)
        setTimeout(() => {
            cursorImage.remove();
            // Retirer la position de la liste après la suppression de l'image
            positions.splice(positions.indexOf({ x: x, y: y, size: size }), 1);
        }, 3000);  // Temps de visibilité de l'image avec mouvement
    }

    // Détection du mouvement de la souris
    document.addEventListener("mousemove", (event) => {
        const currentTime = new Date().getTime();
        if (currentTime - lastMoveTime < delay) return;  // Vérifier si le délai est respecté

        lastMoveTime = currentTime; // Mettre à jour le temps du dernier mouvement
        createCursorImage(event.clientX, event.clientY);  // Appel de la fonction avec la position de la souris
    });

    // Détection des événements tactiles pour les appareils mobiles
    document.addEventListener("touchmove", (event) => {
        const currentTime = new Date().getTime();
        if (currentTime - lastMoveTime < delay) return;  // Vérifier si le délai est respecté

        lastMoveTime = currentTime; // Mettre à jour le temps du dernier mouvement
        const touch = event.touches[0];  // Prendre le premier doigt sur l'écran
        createCursorImage(touch.clientX, touch.clientY);  // Appel de la fonction avec la position du doigt
    });

    // Fonction de nettoyage lors de la fin de l'événement tactile
    document.addEventListener("touchend", () => {
        // Réinitialiser les positions et images si nécessaire
        positions.length = 0;
    });
});