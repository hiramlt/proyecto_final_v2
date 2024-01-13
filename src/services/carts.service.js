import CartDao from '../dao/carts.dao.js';

export default class CartsService {
    static getById(cid) {
        return CartDao.getById(cid);
    }
    
    static create() {
        return CartDao.create();
    }

    static async update(cid, data) {
        return CartDao.update(cid, data);
    }

    static delete(cid) {
        return CartDao.delete(cid);
    }

    static async addProducts(cid, pid, quantity) {
        const cart = await CartDao.getById(cid);

        const product = cart.products.find((currentProduct) => currentProduct.product.equals(pid));
        if (product){
            product.quantity = product.quantity + quantity;
        } else {
            cart.products.push({ product: pid, quantity: quantity});
        }

        return CartDao.saveCart(cart);
    }

    static async updateProducts(cid, pid, quantity){
        const cart = await CartDao.getById(cid);
        const product = cart.products.find((currentProduct) => currentProduct.product.equals(pid));
        product.quantity = quantity;
        return CartDao.saveCart(cart);
    }

    static async deleteProducts(cid, pid) {
        const cart = await CartDao.getById(cid);
        const product = cart.products.findIndex((currentProduct) => currentProduct.product.equals(pid));
        cart.products.splice(product, 1);
        return CartDao.saveCart(cart);
    }
}