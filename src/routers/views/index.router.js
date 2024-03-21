import { Router } from 'express';
import { isAuth, validateToken } from '../../utils.js';
import config from '../../config/config.js';
import ProductsController from '../../controllers/products.controller.js';
import CartsController from '../../controllers/carts.controller.js';
import UsersController from '../../controllers/users.controller.js';

const router = Router();

router.get('/login', (req, res) => {
    res.render('login', { title: 'Inicio de sesión' });
});

router.get('/register', (req, res) => {
    res.render('register', { title: 'Registro' });
});

router.get('/profile', isAuth('views'), (req, res) => {
    res.render('profile', { title: 'Mi perfil', user: req.user });
});

router.get('/admin-panel', isAuth('views'), async (req, res) => {
    const users = await UsersController.get()
    res.render('admin', { title: 'Administración de usuarios', users: users }) 
});

router.get('/recover-password', (req, res) => {
    res.render('recover-password', { title: 'Recuperar contraseña' });
});

router.get('/set-password/:token', async (req, res) => {
    const { token } = req.params
    const user_data = await validateToken(token);
    if (!token || !user_data) {
        return res.render('error', { title: 'Error', errorMsg: 'El enlace ha expirado' });
    }

    res.render('set-password', { title: 'Cambiar contraseña', user: user_data })
})

router.get('/products', isAuth('views'), async (req, res, next) => {
    try {
        const products = await ProductsController.get(req.query, `http://localhost:${config.port}/products`);
        res.render('products', { title: "Productos", ...products, user: req.user, isAdmin: req.user.role === 'admin' } );
    } catch (error) {
        next(error);
    }
});

router.get('/cart', isAuth('views'), async (req, res, next) => {
    const user = req.user;
    const cid = user.cart;
    try {
        const cart = await CartsController.getById(cid);
        res.render('cart', { title: "Mi carrito", products: cart.products.map(product => product.toJSON()) });
    } catch (error) {
        next(error);
    }
});

router.get('/ticket', isAuth('views'), async (req, res, next) => {
    const user = req.user;
    const cid = user.cart;
    try {
        const ticket = await CartsController.purchase(cid, user.email)
        res.render('ticket', { title: "Mi compra", purchase_info: ticket.ticket, products: ticket.unavailableProducts });
    } catch (error) {
        next(error);
    }
})

export default router;