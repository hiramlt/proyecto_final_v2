import express from 'express';
import passport from 'passport';
import cookieParse from 'cookie-parser';
import handlebars from 'express-handlebars';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import path from 'path';
import config from './config/config.js';
import errorsEnums from './utils/errors.enums.js';
import { __dirname } from './utils.js';
import { initPassport } from './config/passport.config.js';
import { appLogger } from './utils/logger.js';

import indexRouter from './routers/views/index.router.js';
import testRouter from './routers/api/tests.router.js';
import authRouter from './routers/api/auth.router.js';
import usersRouter from './routers/api/users.router.js';
import productsRouter from './routers/api/products.router.js';
import cartsRouter from './routers/api/carts.router.js';

const swaggerSpec = swaggerJsDoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ecommerce API',
            description: 'Documentación de API ecommerce.'
        },
    },
    apis: [path.join(__dirname, 'docs', '**', '*.yaml')], 
})

const app = express();

app.use(morgan('dev'));
app.use(appLogger);
app.use(express.json());
app.use(cookieParse(config.cookie_secret));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

initPassport();
app.use(passport.initialize());

app.use('/', indexRouter, testRouter);
app.use('/api', authRouter, productsRouter, cartsRouter, usersRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use((error, req, res, next) => {
    switch (error.code) {
        case errorsEnums.BAD_REQUEST_ERROR:
        case errorsEnums.INVALID_PARAMS_ERROR:
        case errorsEnums.INVALID_TYPE_ERROR:
            req.logger.error(error.message)
            res.status(400).json({ error: error.message })            
            break;
        case errorsEnums.NOT_FOUND_ERROR:
            req.logger.error(error.message)
            res.status(404).json({ error: error.message })
            break;
        case errorsEnums.UNAUTHORIZED_ERROR:
            req.logger.warning(error.message)
            res.status(401).json({ error: error.message })
            break;
        case errorsEnums.NO_PERMISSIONS_ERROR:
            req.logger.warning(error.message)
            res.status(403).json({ error: error.message })
            break;
        case errorsEnums.ROUTING_ERROR:
            req.logger.http(error.message)
            res.status(500).json({ error: error.message })
        default:
            req.logger.error(error.message)
            res.status(500).json({ error: error.message })
    }
    next();
})

export default app;
