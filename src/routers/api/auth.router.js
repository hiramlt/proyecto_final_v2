import { Router } from 'express';
import { isAuth } from '../../utils.js';
import AuthController from '../../controllers/auth.controller.js';

const router = Router();

router.post('/auth/register', async (req, res, next) => {
    const { body } = req;
    try {
        await AuthController.register(body);
        req.logger.info('Usuario registrado exitosamente')
        res.status(201).json({ status: 'Success' });
    } catch (error) {
        next(error);
    }
});

router.post('/auth/login', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const token = await AuthController.login(email, password);
        req.logger.info('Sesión iniciada exitosamente')
        return res.cookie('access_token', token, { maxAge: 1000*60*30, httpOnly: true, signed: true })
        .status(200).json({ status: 'Success' })
    } catch (error) {
        next(error);
    }
});

router.get('/auth/me', isAuth('api'), async (req, res, next) => {
    try {
        const user = await AuthController.getCurrentUser(req.user);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

router.post('/auth/recover-password', async (req, res, next) => {
    const { email } = req.body;
    try {
        await AuthController.sendPasswordRecoveryEmail(email)
        res.status(204).end()
    } catch (error) {
        next(error);
    }
});

router.post('/auth/set-password', async (req, res, next) => {
    const { uid, password } = req.body;
    try {
        await AuthController.updatePassword(uid, password);
        res.status(200).json({ status: 'Success'})
    } catch (error) {
        next(error);
    }
});

export default router;