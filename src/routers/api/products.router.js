import { Router } from 'express';
import { isAuth } from '../../utils.js';
import config from '../../config/config.js';
import ProductManager from '../../dao/products.manager.js';

const router = Router();

router.post('/products', isAuth('api'), async (req, res) => {
    const { title, description, code, price, status, stock, category } = req.body; 
    if (!title || !description || !code || !price || !status || !stock || !category){
        return res.status(400).json({ error: "Faltan campos requeridos"});
    }

    try {
        const product = await ProductManager.create({ title, description, code, price, status, stock, category });
        res.status(201).json(product);
    } catch (error) {
        if (error.message === "El producto ya existe"){
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }    

});

router.get('/products', isAuth('api'), async (req, res) => {
    const { limit, page, sort, query } = req.query;
    const products = await ProductManager.get({ limit, page, sort, query }, `http://localhost:${config.port}/api/products`);
    res.status(200).json(products)
});

router.get('/products/:pid', isAuth('api'), async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await ProductManager.getById(pid);
        if (!product) {
            return res.status(404).json({ error: 'No se encontro el producto' });
        }
        res.status(200).json(product);
    } catch (error) {
        if (error.name === 'CastError'){
            return res.status(400).json({ error: "ID invalido" });
        }
        res.status(500).json({ error: error.message });
    }
});

router.put('/products/:pid', isAuth('api'), async (req, res) => {
    const { body } = req;
    const { pid } = req.params;
    
    try {
        const product = await ProductManager.update(pid, body);
        res.status(200).json(product);
    } catch (error) {
        if (error.message === "No se encontro el producto"){
            return res.status(404).json({ error: error.message });
        } 
        if (error.name === 'CastError'){
            return res.status(400).json({ error: "ID invalido" });
        }
        res.status(500).json({ error: error.message });
    }
});

router.delete('/products/:pid', isAuth('api'), async (req, res) => {
    const { pid } = req.params;
    try {
        await ProductManager.delete(pid);
        res.status(204).end();
    } catch (error) {
        if (error.message === "No se encontro el producto"){
            return res.status(404).json({ error: error.message });
        }
        if (error.name === 'CastError'){
            return res.status(400).json({ error: "ID invalido" });
        }
        res.status(500).json({ error: error.message }); 
    }
});

export default router;