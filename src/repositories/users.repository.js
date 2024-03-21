import UsersDTO from '../dto/users.dto.js';
import UsersShortDTO from '../dto/users.short.dto.js';

export default class UsersRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async get(opts = {}) {
        const users = await this.dao.get(opts);
        const formatedUsers = users.map(user => {
            return new UsersShortDTO(user)
        });
        
        return formatedUsers;
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

    async delete(limit_date) {
        return this.dao.delete(limit_date);
    }

    async deleteById(uid) {
        return this.dao.deleteById(uid);
    }

    getCurrentUser(user) {
        const currentUser = new UsersDTO(user);
        return currentUser;
    }
}