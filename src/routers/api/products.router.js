import { Router } from 'express';
import { hasPermission, isAuth, authRole } from '../../utils.js';
import { uploadFile } from '../../utils/uploads.js';
import config from '../../config/config.js';
import ProductsController from '../../controllers/products.controller.js';

const router = Router();

router.use(isAuth('api'))

router.get('/products', async (req, res, next) => {
    try {
        const products = await ProductsController.get(req.query, `http://localhost:${config.port}/api/products`);
        res.status(200).json(products)
    } catch (error) {
        next(error);
    }
});

router.get('/products/:pid', async (req, res, next) => {
    const { pid } = req.params;
    try {
        const product = await ProductsController.getById(pid);
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
});

router.post('/products', uploadFile.array('thumbnails') , authRole('admin', 'premium'), hasPermission(), async (req, res, next) => {
    const { body, files } = req;
    try {
        const product = await ProductsController.create(body, files);
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
});

router.put('/products/:pid', authRole('admin', 'premium'), hasPermission(), async (req, res, next) => {
    const { body } = req;
    const { pid } = req.params;
    try {
        const product = await ProductsController.update(pid, body);
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
});

router.delete('/products/:pid', authRole('admin', 'premium'), hasPermission(), async (req, res, next) => {
    const { pid } = req.params;
    try {
        await ProductsController.delete(pid);
        res.status(204).end();
    } catch (error) {
        next(error);   
    }
});

router.get('/mockingproducts', async (req, res, next) => {
    try {
        const products = ProductsController.mock();
        res.status(200).json({products: products});
    } catch (error) {
        next(error);
    }
});

export default router;