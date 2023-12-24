import { Router } from 'express';
import { isAuth } from '../../utils.js';
import config from '../../config/config.js';
import ProductManager from '../../dao/products.manager.js';
import CartManager from '../../dao/carts.manager.js';

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

router.get('/products', isAuth('views'), async (req, res) => {
    const { limit, page, sort, query } = req.query;
    const products = await ProductManager.get({ limit, page, sort, query }, `http://localhost:${config.port}/products`);
    res.render('products', { title: "Productos", ...products, user: req.user } )
});

router.get('/cart', isAuth('views'), async (req, res) => {
    const user = req.user;
    const cid = user.cart;
    const cart = await CartManager.getById(cid);
    res.render('cart', { title: "Mi carrito", products: cart.products.map(product => product.toJSON()) });
});

export default router;