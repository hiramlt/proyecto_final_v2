import { Router } from 'express'
import { authRole, isAuth } from '../../utils.js'
import { uploadFile } from '../../utils/uploads.js'
import UsersController from '../../controllers/users.controller.js'

const router = Router()

router.use(isAuth('api'))

router.get('/users/', async (req, res, next) => {
    try {
        const users = await UsersController.get()
        res.status(200).json(users);
    } catch (error) {
        next(error)
    }
})

router.delete('/users/', async (req, res, next) => {
    try {
        await UsersController.delete()
        res.status(204).end()
    } catch (error) {
        next(error)
    }
})

router.delete('/users/:uid', async (req, res, next) => {
    const { uid } = req.params
    try {
        await UsersController.deleteById(uid)
        res.status(204).end()
    } catch (error) {
        next(error)
    }
})

router.post('/users/premium/:uid', async (req, res, next) => {
    const { uid } = req.params;
    try {
        const user = await UsersController.updateRole(uid);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

router.post('/users/:uid/documents', uploadFile.fields([
    { name: 'ID', maxCount: 1 },
    { name: 'residency_file', maxCount: 1 },
    { name: 'billing_file', maxCount: 1 },
]), authRole('user', 'premium'), async (req, res, next) => {
    const { uid } = req.params;
    try {
        const user = await UsersController.uploadDocuments(uid, req.files)
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

export default router