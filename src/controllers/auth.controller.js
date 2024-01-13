import UsersService from '../services/users.service.js';
import CartsService from '../services/carts.service.js';
import { InvalidDataException, UnauthorizedException, createToken, createHash, isValidPassword } from '../utils.js';

const admin = {
    first_name: 'admin',
    last_name: 'coder',
    email: 'adminCoder@coder.com',
    password: 'adminCod3r123',
    role: 'admin'
}

export default class AuthController {
    

    static async register(data) {
        const { first_name, last_name, email, password, age } = data;
        if (!first_name || !last_name || !email || !password) {
            throw new InvalidDataException('Faltan campos requeridos')
        }

        const user = await UsersService.getByEmail(email);
        if (user) {
            throw new InvalidDataException('Usuario ya registrado');
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

        if (email === admin.email && password === admin.password) {
            token = createToken(admin);
            return token;
        }
 
        const user = await UsersService.getByEmail(email);
        if (user && isValidPassword(password, user.password)) {
            token = createToken(user);
            return token;
        }

        throw new UnauthorizedException('Correo o contraseña invalidos')
    }
}