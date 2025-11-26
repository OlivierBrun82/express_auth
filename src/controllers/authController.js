// import de mon outil qui me permet de hasher les mots de passe
import bcrypt from 'bcrypt';
// import de mon outil qui me permet de gérer les tokens JWT
import jwt from 'jsonwebtoken';
// import de mon fichier de configuration de variables d'environnement
import { env } from '../config/env.js';
// import de ma connexion à la base de données MySQL
import { pool } from '../db/index.js';
// import de ma fonction de register
import { register } from '../services/auth.service.js';


// fonction pour s'enregistrer
export async function registerController (req, res, next) {
    try {
       
        //appeler ma fonction qui contient ma logique de register
        const user = await register(req.body)
        //la response
        res.status(201).json({
            success: true,
            message:"user créé",
            data: user
        })
    } catch (error) {
        console.error('erreur lors de la creation du compte', error);
        next(error);
    }
}

// fonction pour se connecter
export async function loginController(req, res, next){
    try {
        // récupération de l'email et password dans le body de la requête
        const { email, password } = req.body;
        // on cherche l'user dans la base de données
        const [rows] = await pool.execute('SELECT * FROM user WHERE email = ?', [email]);
        const user = rows[0];
        // on gere le cas ou l'user n'existe pas
        if(!user){
            console.log('User introuvable');
            return res.status(401).json({
                error: 'User introuvable',
                success: false
            });
    }
    // On compare le mot de passe fourni avec le mot de passe hashé dans la base de données
    const match = await bcrypt.compare(password, user.password);
    if(!match){
        console.log('Mot de passe incorrect');
        return res.status(401).json({
            error: 'Mot de passe incorrect',
            success: false
        });
    }
    // On génère un token avec JWT
    const token = jwt.sign(
        { sub: user.id, email: user.email }, // payload
        env.jwtSecret, // clée secrete de mon .env que je récupère via mon fichier env.js
        { expiresIn: '1h' } // durée de validité du token
    )
    // On prépare la réponse (avec le token)
    res.json({token})
    } catch (error) {
        console.error('Erreur lors de la connexion de l\'utilisateur', error);
        next(error);
    }
}

// controller profile
export async function profileController(req, res){
    console.log('test profile controller');
    console.log(req.user);
    res.json({user: req.user});
}
    