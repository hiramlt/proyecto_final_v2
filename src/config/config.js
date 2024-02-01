import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT || 3000,
    mongo_uri: process.env.MONGO_URI || 'mongodb://localhost/27017/ecommerce',
    jwt_secret: process.env.JWT_SECRET || 'secret',
    cookie_secret: process.env.COOKIE_SECRET || 'secret',
    admin: {
        first_name: 'admin',
        last_name: 'coder',
        email: process.env.ADMIN_EMAIL || 'admin@mail.com',
        password: process.env.ADMIN_PASSWORD || 'adminpassword',
        role: 'admin'
    },
    env: process.env.ENV || 'development'
}