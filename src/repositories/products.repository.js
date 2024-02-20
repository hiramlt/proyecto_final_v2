export default class ProductsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    get(filter, opts) {
        return this.dao.get(filter, opts);
    }

    getById(pid) {
        return this.dao.getById(pid);
    }

    getByCode(code) {
        return this.dao.getByCode(code);
    }

    create(data) {
        return this.dao.create(data); 
    }

    update(pid, data) {
        return this.dao.update(pid, data);
    }

    delete(pid) {
        return this.dao.delete(pid);
    }
}