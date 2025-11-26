// import de mon outil qui me permet de gérer les routes
import { Router } from 'express';

// import de nos contrôleurs
import { registerController, loginController, profileController } from '../controllers/authController.js';

// import de notre logique d'authentification
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// route pour s'enregistrer
router.post('/register', registerController);
// route pour se connecter
router.post('/login', loginController);
// route pour afficher son profil
router.get('/profil', authenticate, profileController);


export default router;