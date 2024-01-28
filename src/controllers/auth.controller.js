import UsersService from '../services/users.service.js';
import CartsService from '../services/carts.service.js';
import config from '../config/config.js';
import { createToken, createHash, isValidPassword } from '../utils.js';
import CustomError from '../utils/errors.js';

export default class AuthController {
    static async register(data) {
        const { first_name, last_name, email, password, age } = data;
        if (!first_name || !last_name || !email || !password) {
            CustomError.create({ name: 'Invalid user data', message: 'Faltan campos requeridos', code: 4 })
        }

        const user = await UsersService.getByEmail(email);
        if (user) {
            CustomError.create({ name: 'Invalid user data', message: 'Usuario ya registrado', code: 4 })
        }

        const cart = await CartsService.create();

        return UsersService.create({
            first_name,
            last_name,
            email,
            password: createHash(password),
            age,
            cart: cart._id,
        });
    }

    static async login(email, password) {
        let token;

        if (email === config.admin.email && password === config.admin.password) {
            token = createToken(config.admin);
            return token;
        }
 
        const user = await UsersService.getByEmail(email);
        if (user && isValidPassword(password, user.password)) {
            token = createToken(user);
            return token;
        }

        CustomError.create({ name: 'Unauthorized', message: 'Correo o contraseña invalidos', code: 6 })
    }

    static async getCurrentUser(user) {
        return UsersService.getCurrentUser(user);
    }
}