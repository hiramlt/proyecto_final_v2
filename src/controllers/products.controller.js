import ProductsService from '../services/products.service.js';
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

    static async create(data) {
        const { title, description, code, price, status, stock, category } = data; 
        if (!title || !description || !code || !price || !status || !stock || !category){
            CustomError.create({ name: 'Invalid user data', message: 'Faltan campos requeridos', code: 4 })
        }

        const productExists = await ProductsService.getByCode(code);
        if (productExists) {
            CustomError.create({ name: 'Invalid user data', message: 'El producto ya registrado', code: 4 })
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

        return ProductsService.delete(pid);
    }

    static mock() {
        return ProductsService.mockProducts();
    }
}