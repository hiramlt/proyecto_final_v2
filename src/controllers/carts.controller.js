import { v4 as uuidv4 } from 'uuid';
import CartsService from '../services/carts.service.js';
import ProductsService from '../services/products.service.js';
import TicketsService from '../services/tickets.service.js';
import { InvalidDataException, NotFoundException } from '../utils.js';

export default class CartsController {
    static async #verifyCart(cid) {
        const cart = await CartsService.getById(cid);
        if (!cart) {
            throw new NotFoundException('No se encontro el carrito');
        }
        return cart;
    }

    static async #verifyProduct(pid) {
        const product = await ProductsService.getById(pid);
        if (!product) {
            throw new NotFoundException('No se encontro el producto');
        }
        return product;
    }

    static async #verifyExistence(cart, pid){
        const productExists = cart.products.find((currentProduct) => currentProduct.product.equals(pid));
        if(!productExists) {
            throw new NotFoundException('No se encontro el producto');
        }
    }

    static async getById(cid) {
        const cart = await CartsService.getById(cid);
        if (!cart) {
            throw new NotFoundException('No se encontro el carrito');
        }
        return cart;
    }

    static create() {
        return CartsService.create();
    }

    static async update(cid, data) {
        const isValidData = data.every(product => {
            return (
                typeof product === 'object' && product.hasOwnProperty('product') && product.hasOwnProperty('quantity') 
            )
        });
        if (!isValidData) {
            throw new InvalidDataException('Ingrese un producto válido');
        }

        const cart = await CartsService.getById(cid);
        if (!cart) {
            throw new NotFoundException('No se encontro el carrito');
        }
        await CartsService.update(cid, data);
        return CartsService.getById(cid);
    }

    static async delete(cid) {
        const cart = await CartsService.getById(cid);
        if (!cart) {
            throw new NotFoundException('No se encontro el carrito')
        }
        return CartsService.delete(cid);
    }

    static async addProducts(cid, pid, quantity) {
        await this.#verifyCart(cid);
        await this.#verifyProduct(pid);
        return CartsService.addProducts(cid, pid, quantity);
    }

    static async updateProducts(cid, pid, quantity) {
        const cart = await this.#verifyCart(cid);
        await this.#verifyExistence(cart, pid);
        return CartsService.updateProducts(cid, pid, quantity);
    }

    static async deleteProducts(cid, pid) {
        const cart = await this.#verifyCart(cid);
        await this.#verifyExistence(cart, pid);
        return CartsService.deleteProducts(cid, pid);
    }

    static async purchase(cid, purchaser){
        const cart = await this.#verifyCart(cid); 
        const products = cart.products;

        let availableProducts = []
        let unavailableProducts = []
        let unavailableProductsID = []
        let amount = 0;

        for (const product of products) { 
            let isAvailable = await ProductsService.verifyStock(product.product._id, product.quantity);
            if (isAvailable) {
                amount = (product.product.price * product.quantity) + amount;
                availableProducts.push(product);
                await ProductsService.update(product.product._id, { stock: product.product.stock - product.quantity });
            }  else {
                unavailableProducts.push(product); 
                unavailableProductsID.push({ product: product.product._id }); 
            }
            
        }

        await CartsService.update(cid, unavailableProducts);
        const ticket = await TicketsService.create({code: uuidv4(), amount: amount, purchaser: purchaser})
        return { ticket, unavailableProductsID };
    }
}