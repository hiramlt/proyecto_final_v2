import UserModel from '../models/user.model.js';

export default class UserManager {
    static async getByEmail(email) {
        const user = await UserModel.findOne({ email: email });
        return user;
    }

    static async getByID(uid){
        const user = await UserModel.findById(uid);
        return user;
    }

    static async create(data) {
        const user = await UserModel.create(data);
        return user;
    }
}