import UsersDTO from '../dto/users.dto.js';

export default class UsersRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getByEmail(email) {
        return this.dao.getByEmail(email);
    }

    async getById(uid) {
        return this.dao.getById(uid);
    }

    async create(data) {
        return this.dao.create(data);
    }

    async update(uid, data) {
        return this.dao.update(uid, data);
    }

    async saveUser(user) {
        return this.dao.saveUser(user);
    }

    getCurrentUser(user) {
        const currentUser = new UsersDTO(user);
        return currentUser;
    }
}