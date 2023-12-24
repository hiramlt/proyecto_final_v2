import CartModel from '../models/cart.model.js';
import ProductModel from '../models/product.model.js';

export default class CartManager {
    static async getById(cid) {
        const cart = await CartModel.findById(cid).populate('products.product');
        return cart;
    }

    static async create() {
        const cart = await CartModel.create({});
        return cart;    
    }

    static async update(cid, data) {
        const cart = await CartModel.findById(cid);
        if (!cart) {
            throw new Error("No se encontro el carrito");
        }
        cart.products = data;
        await cart.save();

        return await CartModel.findById(cid).populate('products.product');
    }

    static async delete(cid) {
        const cart = await CartModel.findById(cid);
        if (!cart) {
            throw new Error("No se encontro el carrito");
        }

        cart.products = [];
        await cart.save();
    }

    static async addProducts(cid, pid, quantity) {
        const cart = await CartModel.findById(cid);
        if (!cart) {
            throw new Error("No se encontro el carrito");
        }

        const existentProduct = await ProductModel.findById(pid);
        if (!existentProduct){ 
            throw new Error("No se encontro el producto"); 
        }

        const foundProduct = cart.products.find((currentProduct) => currentProduct.product.equals(pid));
        if (foundProduct){
            foundProduct.quantity = foundProduct.quantity + quantity;
        } else {
            cart.products.push({ product: pid, quantity: quantity});
        }
        await cart.save();

        return await CartModel.findById(cid).populate('products.product');
    }
 
    static async updateProducts(cid, pid, quantity) {
        const cart = await CartModel.findById(cid);
        if (!cart) {
            throw new Error("No se encontro el carrito");
        }

        const existentProduct = cart.products.find((currentProduct) => currentProduct.product.equals(pid));
        if (!existentProduct){
            throw new Error("No se encontro el producto"); 
        }

        existentProduct.quantity = quantity;
        await cart.save(); 

        return await CartModel.findById(cid).populate('products.product');
    }

    static async deleteProducts(cid, pid) {
        const cart = await CartModel.findById(cid);
        if (!cart) {
            throw new Error("No se encontro el carrito");
        }

        const existentProduct = cart.products.findIndex((currentProduct) => currentProduct.product.equals(pid));
        if (existentProduct === -1){
            throw new Error("No se encontro el producto"); 
        }

        cart.products.splice(existentProduct, 1);
        await cart.save();  
    }
};