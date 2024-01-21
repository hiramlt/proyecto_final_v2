export default class CartsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getById(cid){
        return this.dao.getById(cid);
    }

    create() {
        return this.dao.create(); 
    }

    update(cid, data) {
        return this.dao.update(cid, data);
    }

    delete(cid) {
        return this.dao.delete(cid);
    }

    saveCart(cart) {
        return this.dao.saveCart(cart);
    }

    addProducts(cid, pid, quantity) {
        return this.dao.addProducts(cid, pid, quantity);
    }

    updateProducts(cid, pid, quantity) {
        return this.dao.updateProducts(cid, pid, quantity);
    }

    deleteProducts(cid, pid) {
        return this.dao.deleteProducts(cid, pid);
    }
}