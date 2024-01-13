import { Router } from 'express';
import { isAuth } from '../../utils.js';
import AuthController from '../../controllers/auth.controller.js';

const router = Router();

router.post('/auth/register', async (req, res, next) => {
    const { body } = req;
    try {
        await AuthController.register(body);
        res.status(201).redirect('/login');
    } catch (error) {
        next(error);
    }
});

router.post('/auth/login', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const token = await AuthController.login(email, password);
        return res.cookie('access_token', token, { maxAge: 1000*60*30, httpOnly: true, signed: true })
        .status(200).redirect('/products');
    } catch (error) {
        if (error.statusCode === 401) {
            return res.status(401).render('error', { title: 'Error', errorMsg: error.message });
        }
        next(error);
    }
});

router.get('/auth/me', isAuth('api'), async (req, res) => {
    res.status(200).json(req.user);
});

export default router;