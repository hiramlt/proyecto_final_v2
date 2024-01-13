import CartModel from '../models/cart.model.js';

export default class CartDao {
    static getById(cid){
        return CartModel.findById(cid).populate('products.product');
    }

    static create() {
        return CartModel.create({});  
    }

    static update(cid, data) {
        return CartModel.updateOne({ _id: cid }, { $set: { products: data } });
    }

    static delete(cid) {
        return CartModel.updateOne({ _id: cid }, { $set: { products: [] } });
    }

    static async saveCart(cart) {
        await cart.save();
        return CartModel.findById(cart._id).populate('products.product');
    }

    static async addProducts(cid, pid, quantity) {
        const cart = await CartModel.findById(cid);

        const product = cart.products.find((currentProduct) => currentProduct.product.equals(pid));
        if (product){
            product.quantity = product.quantity + quantity;
        } else {
            cart.products.push({ product: pid, quantity: quantity});
        }
        await cart.save();

        return CartModel.findById(cid).populate('products.product');
    }

    static async updateProducts(cid, pid, quantity) {
        const cart = await CartModel.findById(cid);

        const product = cart.products.find((currentProduct) => currentProduct.product.equals(pid));
        product.quantity = quantity;
        await cart.save(); 

        return CartModel.findById(cid).populate('products.product');
    }

    static async deleteProducts(cid, pid) {
        const cart = await CartModel.findById(cid);

        const product = cart.products.findIndex((currentProduct) => currentProduct.product.equals(pid));
        cart.products.splice(product, 1);

        return await cart.save();
    }
};