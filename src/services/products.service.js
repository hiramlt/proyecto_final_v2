import { productsRepository } from '../repositories/index.js';
import { generateProduct } from '../utils.js';

export default class ProductsService {
    static #custom_response(data, url) {
        return {
            status: "Success",
            payload: data.docs.map((doc) => doc.toJSON()),
            totalPages: data.totalPages,
            prevPage: data.prevPage,
            nextPage: data.nextPage,
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            prevLink: data.hasPrevPage ? `${url}?limit=${data.limit}&page=${data.prevPage}` : null,
            nextLink: data.hasNextPage ? `${url}?limit=${data.limit}&page=${data.nextPage}` : null,
        }
    }

    static async get(filter = {}, opts = {}, url) {
        const data = await productsRepository.get(filter, opts);
        return this.#custom_response(data, url);
    }

    static getById(pid) {
        return productsRepository.getById(pid);
    }

    static getByCode(code) {
        return productsRepository.getByCode(code);
    }

    static create(data) {
        return productsRepository.create(data);
    }

    static update(pid, data) {
        return productsRepository.update(pid, data);
    }

    static delete(pid) {
        return productsRepository.delete(pid);
    }

    static async verifyStock(pid, quantity) {
        const product = await productsRepository.getById(pid);
        return product.stock > quantity;
    }

    static mockProducts() {
        const products = [];
        for (let i = 0; i < 100; i++) {
            products.push(generateProduct());
        }
        return products
    }

}