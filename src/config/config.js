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
    email_data: {
        user: process.env.EMAIL_USER || 'test@example.com',
        password: process.env.EMAIL_PASSWORD || 'testpassword',
        service: process.env.EMAIL_SERVICE || 'gmail',
        port: process.env.EMAIL_PORT || '465'
    },
    env: process.env.ENV || 'development'
}