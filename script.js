// Script d'initialisation de la base de données
import { testConnection, pool, createTable } from './src/db/index.js';

const init = async () => {
    try {
        await testConnection();
        await createTable();
        await pool.end();
        console.log('tout est pret pour lancer le serveur');
        process.exit(0);
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
        process.exit(1);
    }
};

init();
