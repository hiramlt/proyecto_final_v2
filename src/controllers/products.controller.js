import ProductsService from '../services/products.service.js';
import { InvalidDataException, NotFoundException } from '../utils.js';

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
            throw new NotFoundException('No se encontro el producto')
        }
        return product;
    }

    static async create(data) {
        const { title, description, code, price, status, stock, category } = data; 
        if (!title || !description || !code || !price || !status || !stock || !category){
            throw new InvalidDataException('Faltan campos requeridos')
        }

        const productExists = await ProductsService.getByCode(code);
        if (productExists) {
            throw new InvalidDataException('El producto ya esta registrado')
        }

        return ProductsService.create(data);
    }

    static async update(pid, data) {
        const product = await ProductsService.getById(pid);
        if (!product) {
            throw new NotFoundException('No se encontro el producto')
        }
        await ProductsService.update(pid, data);
        return ProductsService.getById(pid);
    }

    static async delete(pid) {
        const product = await ProductsService.getById(pid);
        if (!product) {
            throw new NotFoundException('No se encontro el producto')
        }

        return ProductsService.delete(pid);
    }
}