import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db/index.js';
import { env } from '../config/env.js';



export async function register({email, password}) {
    // validation basique (si les champs sont présent)
    if(!email || !password) {
       const error = new Error('email et mdp obligatoire');
       error.status = 400;
       throw error;
    }

    //hash du mdp
    const hash = await bcrypt.hash(password, 10); 
    //enregistrer l'utilisateur dans la db
    const query = `INSERT INTO user (email, password) VALUES (?,?)`;
    const [result] = await pool.execute(query, [email, hash]);

    return {
        id: result.insertId,
        email, 
        created_at: new Date()
    }
}