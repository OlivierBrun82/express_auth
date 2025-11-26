## Projet `express_auth` – API d'authentification avec Express, JWT & MySQL

Ce projet est une API d'authentification basée sur **Node.js**, **Express**, **MySQL**, **bcrypt** (hash de mot de passe) et **JWT** (tokens).  
Elle expose des routes pour **inscription**, **connexion** et **profil protégé** via un middleware d'authentification.

---

## 1. Prérequis

- **Node.js** ≥ 18 (recommandé)
- **npm** (fourni avec Node)
- Une base de données **MySQL** accessible (locale ou distante)

Vérifie que `node -v` et `npm -v` fonctionnent dans ton terminal.

---

## 2. Installation du projet

À la racine du projet (`express_auth`) :

```bash
npm install
```

Cela installe les dépendances principales :

- `express`, `cors`, `morgan`, `dotenv`
- `mysql2`
- `bcrypt`, `jsonwebtoken`
- `nodemon` (en dev)

---

## 3. Configuration de l'environnement

Le projet utilise `dotenv` via `src/config/env.js`.  
Crée un fichier `.env` à la racine avec par exemple :

```bash
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=ton_user_mysql
DB_PASSWORD=ton_mot_de_passe_mysql
DB_NAME=nom_de_ta_base
JWT_SECRET=une_phrase_secrete_pour_signer_les_tokens
```

Les variables obligatoires sont vérifiées au démarrage (`DB_HOST`, `DB_USER`, `DB_NAME`, `DB_PASSWORD`, `JWT_SECRET`, `DB_PORT`).  
Le port HTTP par défaut est `65535` si `PORT` n'est pas défini dans le `.env`.

---

## 4. Base de données attendue

Le code s'attend à une table `user` avec au minimum :

```sql
CREATE TABLE user (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Adapte les types/colonnes selon tes besoins, mais conserve au moins `id`, `email`, `password`, `created_at` pour rester compatible avec l'API.

---

## 5. Scripts npm disponibles

Dans `package.json` :

- **`npm start`** : lance le serveur en mode "production"

  ```bash
  npm start
  ```

  → lance `node src/server.js`.

- **`npm run dev`** : lance le serveur en mode développement avec **nodemon**

  ```bash
  npm run dev
  ```

  → relance automatiquement le serveur à chaque modification de fichier.

---

## 6. Démarrage de l'application

1. Crée et remplis correctement ton fichier `.env`.
2. Démarre ta base MySQL et vérifie que la table `user` existe.
3. À la racine du projet, lance :

   ```bash
   npm run dev
   ```

4. Par défaut, l'application écoute sur `http://localhost:<PORT>`  
   (par exemple `http://localhost:3000` si `PORT=3000`).

En console, après le test de connexion MySQL (`testConnection` dans `src/db/index.js`), tu devrais voir :

> `serveur lancé sur le port <PORT>`

---

## 7. Structure du projet

Structure principale :

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
│  ├─ middlewares/
│  │  └─ auth.middleware.js
│  ├─ routes/
│  │  └─ auth.routes.js
│  └─ services/
│     └─ auth.service.js
└─ README.md
```

- **`src/app.js`** : configuration de l'application Express (middlewares, routes, gestion d'erreurs).
- **`src/server.js`** : point d'entrée qui teste la connexion MySQL puis lance le serveur.
- **`src/config/env.js`** : centralisation et validation des variables d'environnement.
- **`src/db/index.js`** : connexion MySQL (`mysql2`) + fonction `testConnection` + `pool` exporté.
- **`src/controllers/authController.js`** : contrôleurs HTTP pour `register`, `login`, `profile` (appellent la couche service si nécessaire).
- **`src/middlewares/auth.middleware.js`** : middleware `authenticate` qui vérifie le JWT et charge l'utilisateur.
- **`src/routes/auth.routes.js`** : définition des routes d'authentification.

---

## 8. Fonctionnement des principaux fichiers

### 8.1 `src/app.js`

- Initialise Express (`const app = express();`).
- Ajoute les middlewares globaux :
  - `cors()` : gestion des requêtes cross‑origin.
  - `express.json()` : parse le JSON du body des requêtes (`req.body`).
  - `morgan()` : log des requêtes HTTP.
- Déclare une route de test :
  - `GET /test` → renvoie `"route de test ok"` et log dans la console.
- Monte les routes d'authentification :
  - `app.use('/api/auth', authRoutes);`
- Gère les erreurs via un middleware de fin de chaîne :
  - capture toute erreur, log, puis renvoie un JSON `{ error: '...' }` avec le bon `status`.

### 8.2 `src/server.js`

- Importe `app`, `env` et `testConnection`.
- Fonction asynchrone `start()` :
  - `await testConnection();` pour vérifier que la base est accessible.
  - Démarre le serveur : `app.listen(env.port, ...)`.

### 8.3 `src/config/env.js`

- Charge `.env` avec `dotenv.config()`.
- Vérifie la présence des variables requises.
- Exporte un objet `env` :
  - `env.port` : port HTTP.
  - `env.db` : configuration de la connexion MySQL (`host`, `port`, `user`, `password`, `database`).
  - `env.jwtSecret` : clé secrète utilisée pour signer et vérifier les tokens JWT.

### 8.4 `src/controllers/authController.js`

- **`registerController`**
  - Récupère les données du body de la requête (`req.body`).
  - Appelle la fonction de service `register` définie dans `src/services/auth.service.js`.
  - Renvoie `201` avec un JSON du type :

    ```json
    {
      "success": true,
      "message": "user créé",
      "data": {
        "id": 1,
        "email": "user@example.com",
        "created_at": "2025-01-01T12:00:00.000Z"
      }
    }
    ```

- **`loginController`**
  - Récupère `email` / `password` dans `req.body`.
  - Recherche l'utilisateur par email (`SELECT * FROM user WHERE email = ?`).
  - Si aucun utilisateur → `401` "User introuvable".
  - Compare le mot de passe fourni avec le hash en base via `bcrypt.compare`.
  - Si le mot de passe ne correspond pas → `401` "Mot de passe incorrect".
  - Si OK, génère un JWT avec `jwt.sign({ sub: user.id, email: user.email }, env.jwtSecret, { expiresIn: '1h' })`.
  - Renvoie un JSON `{ token: <jwt> }`.
- **`profileController`**
  - Suppose que `req.user` est déjà rempli par le middleware `authenticate`.
  - Renvoie un JSON `{ "user": req.user }`.

### 8.5 `src/services/auth.service.js`

- **`register({ email, password })`**
  - Valide la présence de `email` et `password`.  
    - En cas de champs manquants, lève une erreur avec `status = 400` et le message `"email et mdp obligatoire"`.
  - Hash le mot de passe avec `bcrypt.hash(password, 10)`.
  - Insère l'utilisateur dans la table `user` :

    ```sql
    INSERT INTO user (email, password) VALUES (?, ?)
    ```

  - Retourne un objet utilisateur minimal :

    ```json
    {
      "id": 1,
      "email": "user@example.com",
      "created_at": "2025-01-01T12:00:00.000Z"
    }
    ```

### 8.6 `src/middlewares/auth.middleware.js`

- Récupère le header `Authorization`.
- Extrait le token (format attendu : `Bearer <token>`).
- Si pas de token → `401` "Token absent".
- Vérifie le token avec `jwt.verify(token, env.jwtSecret)`.
- Récupère en base l'utilisateur correspondant à `payload.sub` (`SELECT id, email, created_at FROM user WHERE id = ?`).
- Si aucun utilisateur → `401` "User introuvable".
- Ajoute l'utilisateur à `req.user` puis appelle `next()`.
- En cas d'erreur de vérification de token, renvoie une erreur avec `status = 401` et passe au middleware d'erreur global.

---

## 9. Routes d'API disponibles

Toutes les routes d'authentification sont préfixées par `/api/auth`.

### 9.1 Route de test

- **Méthode** : `GET`
- **URL** : `/test`
- **Réponse** :

  ```json
  "route de test ok"
  ```

### 9.2 Routes d'authentification (`src/routes/auth.routes.js`)

- **Base** : `/api/auth`

#### 9.2.1 Inscription

- **Méthode** : `POST`
- **URL** : `/api/auth/register`
- **Contrôleur** : `registerController`
- **Body attendu** (JSON) :

  ```json
  {
    "email": "user@example.com",
    "password": "motdepassefort"
  }
  ```

- **Réponse (succès)** : `201 Created`

  ```json
  {
    "message": "user créé",
    "success": true,
    "data": {
      "id": 1,
      "email": "user@example.com",
      "created_at": "2025-01-01T12:00:00.000Z"
    }
  }
  ```

  où `data` contient les informations de base de l'utilisateur créé.

#### 9.2.2 Connexion

- **Méthode** : `POST`
- **URL** : `/api/auth/login`
- **Contrôleur** : `loginController`
- **Body attendu** (JSON) :

  ```json
  {
    "email": "user@example.com",
    "password": "motdepassefort"
  }
  ```

- **Réponse (succès)** : `200 OK`

  ```json
  {
    "token": "<JWT_SIGNÉ>"
  }
  ```

  Le token doit être utilisé dans le header `Authorization` pour les routes protégées :

  ```text
  Authorization: Bearer <JWT_SIGNÉ>
  ```

#### 9.2.3 Profil (route protégée)

- **Méthode** : `GET`
- **URL** : `/api/auth/profil`
- **Middleware d'auth** : `authenticate`
- **Contrôleur** : `profileController`
- **Headers requis** :

  ```text
  Authorization: Bearer <JWT_SIGNÉ>
  ```

- **Réponse (succès)** : `200 OK`

  ```json
  {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "created_at": "2025-01-01T12:00:00.000Z"
    }
  }
  ```

---

## 10. Tests rapides avec Postman / Insomnia / Thunder Client

Une fois le serveur lancé (`npm run dev`, par défaut sur `http://localhost:3000`) :

- `GET http://localhost:3000/test`
- `POST http://localhost:3000/api/auth/register`
- `POST http://localhost:3000/api/auth/login`
- `GET http://localhost:3000/api/auth/profil` (avec header `Authorization: Bearer <token>`)

Adapte le port si nécessaire selon ta configuration (`env.port` / variable `PORT`).

---

## 11. Licence

Projet sous licence **ISC** (voir `package.json`). Tu peux adapter la licence selon tes besoins.

