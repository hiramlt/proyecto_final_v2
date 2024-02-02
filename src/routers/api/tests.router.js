import { Router } from 'express'
import { isAuth } from '../../utils.js';

const router = Router();

router.get('/loggerTest', isAuth('api'), (req, res) => {
    req.logger.debug('Test logger (debug) ✅')
    req.logger.http('Test logger (http) ✅')
    req.logger.info('Test logger (info) ✅')
    req.logger.warning('Test logger (warning) ✅')
    req.logger.error('Test logger (error) ✅')
    req.logger.fatal('Test logger (fatal) ✅')
    res.status(200).json({ status: 'Success' });
})

export default router;