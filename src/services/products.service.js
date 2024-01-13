import ProductDao from '../dao/products.dao.js';

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
        const data = await ProductDao.get(filter, opts);
        return this.#custom_response(data, url);
    }

    static getById(pid) {
        return ProductDao.getById(pid);
    }

    static getByCode(code) {
        return ProductDao.getByCode(code);
    }

    static create(data) {
        return ProductDao.create(data);
    }

    static update(pid, data) {
        return ProductDao.update(pid, data);
    }

    static delete(pid) {
        return ProductDao.delete(pid);
    }
}