import { Router } from 'express';
import UserManager from '../../dao/users.manager.js';
import CartManager from '../../dao/carts.manager.js';
import { createHash, createToken, isValidPassword, isAuth } from '../../utils.js';

const router = Router();

const admin = {
    first_name: 'admin',
    last_name: 'coder',
    email: 'adminCoder@coder.com',
    password: 'adminCod3r123',
    role: 'admin'
}

router.post('/auth/register', async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;

    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    let user = await UserManager.getByEmail(email);
    if (user) {
        return res.status(400).json({ error: 'Usuario ya registrado' });
    }

    const cart = await CartManager.create();

    user = await UserManager.create({
        first_name,
        last_name,
        email,
        password: createHash(password),
        age,
        cart: cart._id,
    })

    res.status(201).redirect('/login');
});

router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (email === admin.email && password === admin.password) {
        const token = createToken(admin);
        return res.cookie('access_token', token, { maxAge: 1000*60*30, httpOnly: true, signed: true })
        .status(200).redirect('/products');
    }

    const user = await UserManager.getByEmail(email);
    if (user && isValidPassword(password, user.password)) {
        const token = createToken(user);
        return res.cookie('access_token', token, { maxAge: 1000*60*30, httpOnly: true, signed: true })
        .status(200).redirect('/products');
    }

    res.status(401).render('error', { title: 'Error', errorMsg: 'Correo o contraseña invalidos' });
});

router.get('/auth/me', isAuth('api'), async (req, res) => {
    res.status(200).json(req.user);
});

export default router;