import { Router } from 'express';
import { isAuth } from '../../utils.js';
import config from '../../config/config.js';
import ProductsController from '../../controllers/products.controller.js';

const router = Router();

router.get('/products', isAuth('api'), async (req, res, next) => {
    try {
        const products = await ProductsController.get(req.query, `http://localhost:${config.port}/api/products`);
        res.status(200).json(products)
    } catch (error) {
        next(error);
    }
});

router.get('/products/:pid', isAuth('api'), async (req, res, next) => {
    const { pid } = req.params;
    try {
        console.log("AQUI");
        const product = await ProductsController.getById(pid);
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
});

router.post('/products', isAuth('api'), async (req, res, next) => {
    const { body } = req;
    try {
        const product = await ProductsController.create(body);
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
});

router.put('/products/:pid', isAuth('api'), async (req, res, next) => {
    const { body } = req;
    const { pid } = req.params;
    try {
        const product = await ProductsController.update(pid, body);
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
});

router.delete('/products/:pid', isAuth('api'), async (req, res, next) => {
    const { pid } = req.params;
    try {
        await ProductsController.delete(pid);
        res.status(204).end();
    } catch (error) {
        next(error);   
    }
});

export default router;