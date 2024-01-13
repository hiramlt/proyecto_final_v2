import express from 'express';
import passport from 'passport';
import cookieParse from 'cookie-parser';
import handlebars from 'express-handlebars';
import morgan from 'morgan';
import path from 'path';
import config from './config/config.js';
import { Exception, __dirname } from './utils.js';
import { initPassport } from './config/passport.config.js';

import indexRouter from './routers/views/index.router.js';
import authRouter from './routers/api/auth.router.js';
import productsRouter from './routers/api/products.router.js';
import cartsRouter from './routers/api/carts.router.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParse(config.cookie_secret));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

initPassport();
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/api', authRouter, productsRouter, cartsRouter);

app.use((error, req, res, next) => {
    const err_msg = error instanceof Exception ? error.message : `Ocurrio un error desconocido: ${error.message}`
    res.status(error.statusCode || 500).json({ error: err_msg })
    next();
})

export default app;
