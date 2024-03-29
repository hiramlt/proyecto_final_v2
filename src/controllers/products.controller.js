import ProductsService from '../services/products.service.js';
import UsersService from '../services/users.service.js';
import EmailService from '../services/email.service.js';
import config from '../config/config.js';
import CustomError from '../utils/errors.js';

export default class ProductsController {
    static get(data, url) {
        const filter = {}
        const opts = { limit: data.limit || 10, page: data.page || 1 }

        if (data.sort) { opts.sort = { price: data.sort } }
        if (data.query) { filter.category = data.query } 

        return ProductsService.get(filter, opts, url);
    }

    static async getById(pid){
        const product = await ProductsService.getById(pid);
        if (!product) {
            CustomError.create({ name: 'Not found', message: 'No se encontro el producto', code: 5 })
        }
        return product;
    }

    static async create(data, thumbnails) {
        const { title, description, code, price, status, stock, category } = data; 
        if (!title || !description || !code || !price || !status || !stock || !category){
            CustomError.create({ name: 'Invalid data', message: 'Faltan campos requeridos', code: 4 })
        }

        const productExists = await ProductsService.getByCode(code);
        if (productExists) {
            CustomError.create({ name: 'Invalid data', message: 'El producto ya registrado', code: 4 })
        }

        if (data.owner){
            const userExists = await UsersService.getByEmail(data.owner);
            if (!userExists) {
                CustomError.create({ name: 'Invalid data', message: 'El usuario no esta registrado', code: 4 })
            }
        }

        if (thumbnails) {
            const product_thumbnails = []
            thumbnails.forEach(image => {
                const file_path = image.destination.split('\\')
                product_thumbnails.push(`/${file_path[file_path.length -1]}/${image.filename}`)
            });

            data.thumbnails = product_thumbnails
        }

        return ProductsService.create(data);
    }

    static async update(pid, data) {
        const product = await ProductsService.getById(pid);
        if (!product) {
            CustomError.create({ name: 'Not found', message: 'No se encontro el producto', code: 5 })
        }
        await ProductsService.update(pid, data);
        return ProductsService.getById(pid);
    }

    static async delete(pid) {
        const product = await ProductsService.getById(pid);
        if (!product) {
            CustomError.create({ name: 'Not found', message: 'No se encontro el producto', code: 5 })
        }

        if (product.owner !== config.admin.email) {
            const user = await UsersService.getByEmail(product.owner)
            if (user) await EmailService.sendProductDeleteNotification(user, product)
        }

        return ProductsService.delete(pid);
    }

    static mock() {
        return ProductsService.mockProducts();
    }
}