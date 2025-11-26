import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js'

const app = express();

//middleware qui gere les requetes cross-origin
app.use(cors());

//middleware qui parse le contenu du body de ma requête (req.body)
app.use(express.json());

//middleware qui log les requetes
app.use(morgan());

//petite route de test
app.get('/test', (req, res)=>{
    console.log('route de test ok');
    res.send('route de test ok');
})

//route parent pour l'auth
app.use('/api/auth', authRoutes);

//middleware qui gere les erreurs, capture tout type d'erreur et renvoi une response
app.use((err, req, res, next)=>{
    console.error(err);
    res.status(err.status || 500).json({
        error: err.message || 'erreur serveur'
    });
});

export default app;
