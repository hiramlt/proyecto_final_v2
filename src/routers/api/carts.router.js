import { Router } from 'express';
import { isAuth } from '../../utils.js';
import CartsController from '../../controllers/carts.controller.js';

const router = Router();

router.get('/carts/:cid', isAuth('api'), async (req, res, next) => {
    const { cid } = req.params;
    try {
        const cart = await CartsController.getById(cid);
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
});

router.post('/carts', isAuth('api'), async (req, res, next) => {
    try {
        const cart = await CartsController.create();
        res.status(201).json(cart);
    } catch (error) {
        next(error);
    }
});

router.put('/carts/:cid', isAuth('api'), async (req, res, next) => {
    const { cid } = req.params;
    const { body } = req;
    try {
        const cart = await CartsController.update(cid, body);
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
});

router.delete('/carts/:cid', isAuth('api'), async (req, res, next) => {
    const { cid } = req.params;
    try {
        await CartsController.delete(cid);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
}); 

router.post('/carts/:cid/product/:pid', isAuth('api'), async (req, res, next) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const cart = await CartsController.addProducts(cid, pid, quantity);
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
});

router.put('/carts/:cid/product/:pid', isAuth('api'), async (req, res, next) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const cart = await CartsController.updateProducts(cid, pid, quantity);
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
});

router.delete('/carts/:cid/product/:pid', isAuth('api'), async (req, res, next) => {
    const { cid, pid } = req.params;
    try {
        await CartsController.deleteProducts(cid, pid);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
});

export default router;