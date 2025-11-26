
// fonction pour s'enregistrer
export async function registerController(req, res){
    console.log('registerController');
    res.send('registerController');
}

// fonction pour se connecter
export async function loginController(req, res){
    console.log('loginController');
    res.send('loginController');
}

// fonction pour afficher son profil
export async function ProfileController(req, res){
    console.log('ProfileController');
    res.send('ProfileController');
}
