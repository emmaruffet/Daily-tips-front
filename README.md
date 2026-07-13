# Daily Tips - Blog de partage de bons plans

## Description
Daily Tips est une plateforme de blog collaborative permettant aux utilisateurs de partager et de consulter des bons plans sur diverses thématiques (voyage, lifestyle, nutrition, etc.). Le projet est conçu avec une architecture fullstack moderne.

## 🛠 Stack Technique

### Back-end
* **Runtime :** Node.js
* **Framework :** Express.js
* **Base de données :** SQLite
* **ORM :** Sequelize
* **Authentification :** JWT (JSON Web Tokens) avec hachage bcrypt

### Front-end
* **Web :** React (TypeScript) + Vite
* **Style :** Tailwind CSS
* **Mobile :** Android (Jetpack Compose / Java)

### DevOps & Qualité
* **Déploiement :** Docker & Docker Compose
* **CI/CD :** GitHub Actions (Tests automatisés Jest)

## 🚀 Installation & Lancement

1. **Cloner le dépôt :**
   `git clone https://github.com/votre-utilisateur/daily-tips.git`
   `cd daily-tips`

2. **Configuration :**
   Créez un fichier `.env` à la racine du dossier `Blog-back` avec les variables suivantes :
   `PORT=3000`
   `JWT_SECRET=votre_secret_tres_securise`

3. **Lancement avec Docker :**
   `docker-compose up --build`

## 📋 Fonctionnalités du Dashboard
Le Dashboard est accessible selon les rôles utilisateurs :
* **Admin :** Gestion complète (Création, Modification, Suppression d'articles et de catégories).
* **Editor :** Rédaction et modification d'articles.
* **Reader :** Consultation des articles et ajout de likes/commentaires.

## 🧪 Tests
Le projet intègre une suite de tests unitaires avec Jest.
`cd Blog-back`
`npm install`
`npm test`
