import { usersRepository } from '../repositories/index.js';

export default class UsersService {
    static getByEmail(email) {
        return usersRepository.getByEmail(email);
    }

    static getById(uid) {
        return usersRepository.getById(uid);
    }

    static create(data) {
        return usersRepository.create(data);
    }

    static update(uid, data) {
        return usersRepository.update(uid, data);
    }

    static getCurrentUser(user) {
        return usersRepository.getCurrentUser(user);
    }
}