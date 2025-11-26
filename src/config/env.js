// chargement des variables d'environnement
import dotenv from 'dotenv';
dotenv.config();

// lister et vérifier les variables d'environnement requises
const require = [
    'DB_HOST',
    'DB_USER',
    'DB_NAME',
    'DB_PASSWORD',
    'JWT_SECRET',
    'DB_PORT',
];

// boucle pour vérifier si les variables d'environnement sont présentes
for(const key of require){
    if(!process.env[key] === undefined){
        throw new Error(`${key} est absent, veuillez compléter le fichier .env`);
    }
}

// récupérer les information de mon fichier .env
export const env = {
    port: process.env.PORT ?? 65535,
    db: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) ?? 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD ?? '',
        database: process.env.DB_NAME
       },
       jwtSecret: process.env.JWT_SECRET
};