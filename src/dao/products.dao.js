import ProductModel from '../models/product.model.js';

export default class ProductDao {
    static get(filter = {}, opts = {}) {
        return ProductModel.paginate(filter, opts);
    }

    static getById(pid) {
        return ProductModel.findById(pid);
    }

    static getByCode(code) {
        return ProductModel.findOne({ code: code });
    }

    static create(data) {
        return ProductModel.create(data); 
    }

    static update(pid, data) {
        return ProductModel.updateOne({ _id: pid }, { $set: data });
    }

    static delete(pid) {
        return ProductModel.deleteOne({ _id: pid });
    }
}