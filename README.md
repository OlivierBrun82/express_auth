## Projet `express_auth` – API d'authentification avec Express & MySQL

Ce projet est une petite API d'authentification basée sur **Node.js**, **Express** et **MySQL**.  
Il utilise une structure modulaire (app / server / routes / controllers) et est prêt à être étendu avec une vraie logique d'auth (hash de mot de passe, JWT, middleware d'authentification, etc.).

---

## 1. Prérequis

- **Node.js** ≥ 18 (recommandé)
- **npm** (fourni avec Node)
- Une base de données **MySQL** accessible (locale ou distante)

Assure‑toi que `node -v` et `npm -v` fonctionnent dans ton terminal.

---

## 2. Installation du projet

Dans ton terminal, à la racine du projet (`express_auth`) :

```bash
npm install
```

Cela installe toutes les dépendances listées dans `package.json` :

- `express`
- `cors`
- `morgan`
- `dotenv`
- `mysql2`
- `bcrypt`
- `jsonwebtoken`
- `nodemon` (en dev)

---

## 3. Configuration de l'environnement

Le projet utilise `dotenv` via le module `src/config/env.js`.  
Crée un fichier `.env` à la racine du projet (au même niveau que `package.json`) avec au minimum :

```bash
PORT=3000
DB_HOST=localhost
DB_USER=ton_user_mysql
DB_PASSWORD=ton_mot_de_passe_mysql
DB_NAME=nom_de_ta_base
```

Adapte les noms de variables à ce qui est attendu dans `src/config/env.js` (par exemple : nom exact des clés, port, etc.).

---

## 4. Scripts npm disponibles

Dans `package.json` :

- **`npm start`** : lance le serveur en mode production

  ```bash
  npm start
  ```

  Lance `node src/server.js`.

- **`npm run dev`** : lance le serveur en mode développement avec **nodemon**

  ```bash
  npm run dev
  ```

  Relance automatiquement le serveur à chaque modification de fichier.

---

## 5. Démarrage de l'application

1. Vérifie que ton fichier `.env` est créé et correct.
2. Assure‑toi que ta base MySQL est démarrée.
3. Dans le terminal, à la racine du projet :

   ```bash
   npm run dev
   ```

4. Par défaut (selon `src/config/env.js`), l'application écoutera sur `http://localhost:<PORT>`  
   (par exemple `http://localhost:3000` si `PORT=3000`).

Dans la console, tu devrais voir un message du type :

> `serveur lancé sur le port 3000`

après le test de connexion à la base (`testConnection` dans `src/db/index.js`).

---

## 6. Structure du projet

Structure principale des fichiers :

```text
express_auth/
├─ package.json
├─ script.js
├─ src/
│  ├─ app.js
│  ├─ server.js
│  ├─ config/
│  │  └─ env.js
│  ├─ db/
│  │  └─ index.js
│  ├─ controllers/
│  │  └─ authController.js
│  └─ routes/
│     └─ auth.routes.js
└─ README.md
```

- **`src/app.js`** : configure l'application Express (middlewares, routes, gestion d'erreurs).
- **`src/server.js`** : point d'entrée qui lance le serveur et teste la connexion MySQL.
- **`src/config/env.js`** : centralise la configuration d'environnement (lecture des variables `.env`).
- **`src/db/index.js`** : configuration de la connexion MySQL (`mysql2`) + fonction `testConnection`.
- **`src/routes/auth.routes.js`** : définition des routes d'authentification.
- **`src/controllers/authController.js`** : logique des contrôleurs `register`, `login`, `profile`.

---

## 7. Fonctionnement des principaux fichiers

### 7.1 `src/app.js`

- Initialise Express (`const app = express();`).
- Ajoute les middlewares :
  - `cors()` : gestion des requêtes cross‑origin.
  - `express.json()` : parse le JSON du body des requêtes (`req.body`).
  - `morgan()` : log des requêtes HTTP.
- Déclare une route de test :

  - `GET /test` → renvoie `"route de test ok"` et log dans la console.

- Monte les routes d'authentification :

  - `app.use('/api/auth', authRoutes);`

- Gère les erreurs via un middleware de fin de chaîne :

  - Capture toute erreur et renvoie une réponse JSON avec `status` et `message`.

### 7.2 `src/server.js`

- Importe `app` depuis `src/app.js`.
- Importe la configuration d'environnement depuis `src/config/env.js`.
- Importe `testConnection` depuis `src/db/index.js`.
- Fonction asynchrone `start()` :
  - Appelle `await testConnection();` pour vérifier que la base est accessible.
  - Démarre l'écoute HTTP : `app.listen(env.port, ...)`.

---

## 8. Routes d'API disponibles

Toutes les routes d'auth sont préfixées par `/api/auth` (voir `app.js`).

### 8.1 Route de test

- **Méthode** : `GET`
- **URL** : `/test`
- **Réponse** :

  ```json
  "route de test ok"
  ```

### 8.2 Authentification (`src/routes/auth.routes.js`)

- **Base** : `/api/auth`

#### 8.2.1 Inscription

- **Méthode** : `POST`
- **URL** : `/api/auth/register`
- **Contrôleur** : `registerController`
- **Body attendu** : à définir (par exemple `{ "email": "...", "password": "..." }`).
- **Réponse actuelle** (placeholder) :

  ```text
  registerController
  ```

  Le contrôleur se contente pour l'instant de loguer dans la console et de renvoyer un texte simple.

#### 8.2.2 Connexion

- **Méthode** : `POST`
- **URL** : `/api/auth/login`
- **Contrôleur** : `loginController`
- **Body attendu** : à définir (ex : `{ "email": "...", "password": "..." }`).
- **Réponse actuelle** :

  ```text
  loginController
  ```

#### 8.2.3 Profil

- **Méthode** : `GET`
- **URL** : `/api/auth/profile`
- **Contrôleur** : `ProfileController`
- **Middleware d'auth** : à brancher plus tard (ex : `authenticate`).
- **Réponse actuelle** :

  ```text
  ProfileController
  ```

---

## 9. Évolution recommandée du projet

Quelques pistes pour la suite :

- **Connexion MySQL complète** : ajouter les requêtes SQL pour créer / lire / mettre à jour les utilisateurs.
- **Hash de mot de passe** : utiliser `bcrypt` dans `registerController` et `loginController`.
- **JWT** :
  - Générer un token JWT lors du login (`jsonwebtoken`).
  - Créer un middleware `authenticate` qui :
    - lit le header `Authorization: Bearer <token>`
    - vérifie le token
    - ajoute les infos utilisateur dans `req.user`.
- **Protection des routes** : activer le middleware `authenticate` sur `/api/auth/profile` (et autres routes sensibles).
- **Validation des données** : ajouter une validation côté serveur (ex : `Joi`, `zod`, middleware custom, etc.).

---

## 10. Tests rapides avec Postman / Insomnia / Thunder Client

Une fois le serveur lancé (`npm run dev`), tu peux tester les endpoints :

- `GET http://localhost:3000/test`
- `POST http://localhost:3000/api/auth/register`
- `POST http://localhost:3000/api/auth/login`
- `GET http://localhost:3000/api/auth/profile`

Adapte le port si nécessaire selon ta configuration (`env.port` / variable `PORT`).

---

## 11. Licence

Projet sous licence **ISC** (voir `package.json`). Tu peux adapter la licence selon tes besoins.


