import { Router } from 'express';
import { isAuth } from '../../utils.js';
import config from '../../config/config.js';
import ProductsController from '../../controllers/products.controller.js';
import CartsController from '../../controllers/carts.controller.js';

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

router.get('/products', isAuth('views'), async (req, res, next) => {
    try {
        const products = await ProductsController.get(req.query, `http://localhost:${config.port}/products`);
        res.render('products', { title: "Productos", ...products, user: req.user } );
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

export default router;