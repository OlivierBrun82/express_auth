import app from './app.js'; // importation de l'application
import { env } from './config/env.js'; // importation de l'environnement
import { testConnection } from './db/index.js'; // importation de la fonction de test de connexion à la base de données

// fonction qui lance le serveur
async function start() {
    // test de connexion à la base de données
    await testConnection();

    // lancement du serveur
    app.listen(env.port, ()=>{
        console.log(`serveur lancé sur le port ${env.port}`);
    })
}

start();