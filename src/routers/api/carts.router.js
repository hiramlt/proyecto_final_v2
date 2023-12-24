import { Router } from 'express';
import { isAuth } from '../../utils.js';
import CartManager from '../../dao/carts.manager.js';

const router = Router();

const validateData = async (req, res, next) => {
    const { products } = req.body;
    const valid = products.every(product => {
        return (
            typeof product === 'object' && product.hasOwnProperty('product') && product.hasOwnProperty('quantity') 
        )
    });
    if (!valid) {
        res.status(400).json({ error: "Incorrect data" });
    }
    next();
};

router.post('/carts', isAuth('api'), async (req, res) => {
    const cart = await CartManager.create();
    res.status(201).json(cart);
});

router.get('/carts/:cid', isAuth('api'), async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await CartManager.getById(cid);
        if (!cart) {
            return res.status(404).json({ error: "No se encontro el carrito" });
        }
        res.status(200).json(cart);
    } catch (error) {
        if (error.name === 'CastError'){
            return res.status(400).json({ error: "ID invalido" });
        }
        res.status(500).json({ error: error.message });
    }
});

router.put('/carts/:cid', isAuth('api'), validateData, async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
        const cart = await CartManager.update(cid, products);
        res.status(200).json(cart);
    } catch (error) {
        if (error.message === "No se encontro el carrito"){
            return res.status(404).json({ error: error.message });
        }
        if (error.name === "CastError"){
            return res.status(400).json({ error: "ID invalido" });
        }
        if (error.name === "ValidationError"){
            return res.status(400).json({ error: "ID invalido de producto" });
        }
        res.status(500).json({ error: error.message });
    }
}); 

router.delete('/carts/:cid', isAuth('api'), async (req, res) => {
    const { cid } = req.params;
    try {
        await CartManager.delete(cid);
        res.status(204).end();
    } catch (error) {
        if (error.message === "No se encontro el carrito"){
            return res.status(404).json({ error: error.message });
        }
        if (error.name === 'CastError'){
            return res.status(400).json({ error: "ID invalido" });
        }
        res.status(500).json({ error: error.message });
    }
}); 

router.post('/carts/:cid/product/:pid', isAuth('api'), async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await CartManager.addProducts(cid, pid, quantity);
        res.status(200).json(cart);
    } catch (error) {
        if (error.message === "No se encontro el carrito" || error.message === "No se encontro el producto"){
            return res.status(404).json({ error: error.message });
        }
        if (error.name === 'CastError'){
            return res.status(400).json({ error: "ID invalido" });
        }
        res.status(500).json({ error: error.message });
    }
});

router.put('/carts/:cid/product/:pid', isAuth('api'), async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await CartManager.updateProducts(cid, pid, quantity);
        res.status(200).json(cart);
    } catch (error) {
        if (error.message === "No se encontro el carrito" || error.message === "No se encontro el producto"){
            return res.status(404).json({ error: error.message });
        }
        if (error.name === 'CastError'){
            return res.status(400).json({ error: "ID invalido" });
        }
        res.status(500).json({ error: error.message });
    }
});

router.delete('/carts/:cid/product/:pid', isAuth('api'), async (req, res) => {
    const { cid, pid } = req.params;

    try {
        await CartManager.deleteProducts(cid, pid);
        res.status(204).end();
    } catch (error) {
        if (error.message === "No se encontro el carrito" || error.message === "No se encontro el producto"){
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

export default router;