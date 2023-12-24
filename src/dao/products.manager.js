import ProductModel from '../models/product.model.js';

export default class ProductManager {
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

    static async get(params, url) {
        const query = {}
        const options = { limit: params.limit ?? 10, page: params.page ?? 1 } 

        if (params.sort) { options.sort = { price: params.sort } }
        if (params.query) { query.category = params.query }
    
        const data = await ProductModel.paginate(query, options);
        return this.#custom_response(data, url);
    }

    static async getById(pid) {
        const product = await ProductModel.findById(pid);
        return product;
    }

    static async create(data) {
        const existentProduct = await ProductModel.findOne({ code: data.code });
        if (existentProduct){ 
            throw new Error("El producto ya existe"); 
        }
        
        const product = await ProductModel.create(data);
        return product;  
    }

    static async update(pid, data) {
        const existentProduct = await ProductModel.findById(pid);
        if (!existentProduct){ 
            throw new Error("No se encontro el producto"); 
        }

        await ProductModel.updateOne({ _id: pid }, { $set: data });
        return await ProductModel.findById(pid);
    }

    static async delete(pid) {
        const existentProduct = await ProductModel.findById(pid);
        if (!existentProduct){ 
            throw new Error("No se encontro el producto"); 
        }

        await ProductModel.deleteOne({ _id: pid });
    }
}