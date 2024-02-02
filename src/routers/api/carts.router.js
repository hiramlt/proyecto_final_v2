import { Router } from 'express';
import { authRole, isAuth } from '../../utils.js';
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
        req.logger.info('Productos eliminados del carrito')
        res.status(204).end();
    } catch (error) {
        next(error);
    }
}); 

router.post('/carts/:cid/product/:pid', isAuth('api'), authRole('user'), async (req, res, next) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const cart = await CartsController.addProducts(cid, pid, quantity);
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
});

router.put('/carts/:cid/product/:pid', isAuth('api'), authRole('user'), async (req, res, next) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const cart = await CartsController.updateProducts(cid, pid, quantity);
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
});

router.delete('/carts/:cid/product/:pid', isAuth('api'), authRole('user'), async (req, res, next) => {
    const { cid, pid } = req.params;
    try {
        await CartsController.deleteProducts(cid, pid);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
});

router.post('/carts/:cid/purchase', isAuth('api'), async (req, res, next) => {
    const { cid } = req.params;
    try {
        const { ticket, unavailableProductsID } = await CartsController.purchase(cid, req.user.email);
        if (unavailableProductsID.length > 0) {
            return res.status(200).json({ticket: ticket, unavailableProducts: unavailableProductsID})
        }
        req.logger.info('Compra realizada exitosamente')
        res.status(200).json(ticket);  
    } catch (error) {
        next(error);
    }
});

export default router;