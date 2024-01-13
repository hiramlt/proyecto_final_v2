import UserDao from '../dao/users.dao.js';

export default class UsersService {
    static getByEmail(email) {
        return UserDao.getByEmail(email);
    }

    static getById(uid) {
        return UserDao.getById(uid);
    }

    static create(data) {
        return UserDao.create(data);
    }
}