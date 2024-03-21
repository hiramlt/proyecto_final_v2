import path from 'path';
import url from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from './config/config.js';
import passport from 'passport';
import { faker } from '@faker-js/faker'
import CustomError from './utils/errors.js';
import ProductsController from './controllers/products.controller.js';
import UsersService from './services/users.service.js';


const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, userPassword) => bcrypt.compareSync(password, userPassword);

export const createToken = (user) => {
    const payload = typeof user.toJSON === 'function' ? user.toJSON() : user; 
    return jwt.sign(payload, config.jwt_secret, { expiresIn: '30m' });
}

export const createPasswRecoveryToken = (data) => {
    const payload = data;
    return jwt.sign(payload, config.jwt_secret, { expiresIn: '60m' });
}

export const validateToken = (token) => {
    return new Promise((resolve) => {
        jwt.verify(token, config.jwt_secret, (error, payload) => {
            if (error) {
                return resolve(false);
            }
            resolve(payload);
        });
    });
}

export const isAuth = (section) => (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (error, payload, info) => {
        if (error) { 
            return section === 'api' ? next(error) :
            res.render('error', { title: 'Error', errorMsg: error.message });
        }
        if (!payload) {
            return section === 'api' ? 
            CustomError.create({ name: 'Unauthorized', message: info.message ? info.message : info.toString(), code: 6 }) :
            res.render('error', { title: 'Error', errorMsg: info.message ? info.message : info.toString() });
        }
        req.user = payload;
        next();
    })(req, res, next);
}

export const authRole = (role1, role2) => async (req, res, next) => {
    try {
        if(!req.user) {
            CustomError.create({ name: 'Unauthorized', message: 'Unauthorized', code: 6 })
        }
        
        let user = req.user.role !== 'admin' ? await UsersService.getById(req.user._id) : req.user;
        if(user.role !== role1 && user.role !== role2) {
            CustomError.create({ name: 'No permissions', message: 'No permissions', code: 7 })
        }
        next();
    } catch (error) {
        next(error);
    }
}

export const hasPermission = () => async (req, res, next) => {
    try {
        if (req.params.pid) {
            const product = await ProductsController.getById(req.params.pid);
            if (req.user.email !== config.admin.email && product.owner !== req.user.email) {
                CustomError.create({ name: 'No permissions', message: 'No permissions', code: 7 })
            } 
        }
        next()    
    } catch (error) {
        next(error);
    }
}   

export const isNotOwner = () => async (req, res, next) => {
    try {
        if (req.params.pid) {
            const product = await ProductsController.getById(req.params.pid);
            if (product.owner === req.user.email) {
                CustomError.create({ name: 'Invalid own product', message: 'This product can not be added to cart', code: 4 })
            }
        }
        next();
    } catch (error) {
        next(error);
    }
}

export const generateProduct = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.string.alphanumeric(8),
    price: faker.commerce.price(),
    status: faker.lorem.slug({ min: 1, max: 3 }),
    stock: faker.number.int({ min: 1, max: 999 }),
    category: faker.commerce.department(),
    thumbnails: [
      faker.image.url(),
      faker.image.url()
    ],
    owner: config.admin.email,
    createdAt: faker.date.recent(),
    updatedAt: faker.date.soon(),
    __v: faker.number.int({ min: 0, max: 8})
  }
}

