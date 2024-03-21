import { usersRepository } from '../repositories/index.js';

export default class UsersService {
    static get(opts = {}) { 
        return usersRepository.get(opts);
    }

    static delete(limit_date) {
        return usersRepository.delete(limit_date);
    }

    static deleteById(uid) {
        return usersRepository.deleteById(uid);
    }

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

    static async addDocuments(uid, document) {
        const user = await usersRepository.getById(uid);

        const document_idx = user.documents.findIndex(doc => doc.name === document.name);
        if (document_idx !== -1) {
            user.documents.splice(user.documents[document_idx], 1);
        }

        user.documents.push(document);
        return usersRepository.saveUser(user)
    }

    static getCurrentUser(user) {
        return usersRepository.getCurrentUser(user);
    }
}