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

    create(data) {
        return this.dao.create(data);
    }

    getCurrentUser(user) {
        const currentUser = new UsersDTO(user);
        return currentUser;
    }
}