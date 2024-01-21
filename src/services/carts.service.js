import { cartsRepository } from '../repositories/index.js';

export default class CartsService {
    static getById(cid) {
        return cartsRepository.getById(cid);
    }
    
    static create() {
        return cartsRepository.create();
    }

    static async update(cid, data) {
        return cartsRepository.update(cid, data);
    }

    static delete(cid) {
        return cartsRepository.delete(cid);
    }

    static async addProducts(cid, pid, quantity) {
        const cart = await cartsRepository.getById(cid);

        const product = cart.products.find((currentProduct) => currentProduct.product.equals(pid));
        if (product){
            product.quantity = product.quantity + quantity;
        } else {
            cart.products.push({ product: pid, quantity: quantity});
        }

        return cartsRepository.saveCart(cart);
    }

    static async updateProducts(cid, pid, quantity){
        const cart = await cartsRepository.getById(cid);
        const product = cart.products.find((currentProduct) => currentProduct.product.equals(pid));
        product.quantity = quantity;
        return cartsRepository.saveCart(cart);
    }

    static async deleteProducts(cid, pid) {
        const cart = await cartsRepository.getById(cid);
        const product = cart.products.findIndex((currentProduct) => currentProduct.product.equals(pid));
        cart.products.splice(product, 1);
        return cartsRepository.saveCart(cart);
    }
}