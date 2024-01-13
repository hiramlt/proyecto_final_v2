import path from 'path';
import url from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from './config/config.js';
import passport from 'passport';

const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, userPassword) => bcrypt.compareSync(password, userPassword);

export const createToken = (user) => {
    const payload = {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        cart: user.cart,
        role: user.role,
    }
    return jwt.sign(payload, config.jwt_secret, { expiresIn: '30m' });
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
            res.status(401).json({ error: info.message ? info.message : info.toString() }) :
            res.render('error', { title: 'Error', errorMsg: info.message ? info.message : info.toString() });
        }
        req.user = payload;
        next();
    })(req, res, next);
}

export class Exception extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
  
export class InvalidDataException extends Exception {
  constructor(message) {
    super(message, 400);
  }
}
  
export class NotFoundException extends Exception {
  constructor(message) {
    super(message, 404);
  }
}

export class UnauthorizedException extends Exception {
  constructor(message) {
    super(message, 401);
  }
}
  
