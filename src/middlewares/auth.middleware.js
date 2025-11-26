// import de mon outil qui me permet de gérer les tokens JWT
import jwt from 'jsonwebtoken';
// import de mon fichier de configuration de variables d'environnement
import { env } from '../config/env.js';
// outil de connexion à la base de données
import { pool } from '../db/index.js';

export async function authenticate(req, res, next) {
    try {
        // on récupère le token dans le header Authorization
        const authorization = req.headers.authorization;
        const token = authorization.replace('Bearer ', '');
        // gere le cas ou le token est absent        
        if(!token){
            return res.status(401).json({
                error: 'Token absent',
                success: false
            });
        }
        // gere le cas ou le token est invalide
        const payload = jwt.verify(token, env.jwtSecret);
        // récupérer le user
        const [rows] = await pool.execute('SELECT id, email, created_at FROM user WHERE id = ?', [payload.sub]);
        if(!rows[0]){
            return res.status(401).json({
                error: 'User introuvable',
                success: false
            });
        }


        // on ajoute le user à la requête
        req.user = rows[0];
        next();
    } catch (error) {
        error.status=401;
        next(error);
    }
}
