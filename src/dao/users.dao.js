import UserModel from '../models/user.model.js';

export default class UserDao {
    static get(opts = {}) {
        return UserModel.find(opts);
    }

    static getByEmail(email) {
        return UserModel.findOne({ email: email });  
    }

    static getById(uid){
        return UserModel.findById(uid);
    }

    static create(data) {
        return UserModel.create(data);    
    }

    static update(uid, data) {
        return UserModel.updateOne({ _id: uid }, { $set: data });
    }

    static async saveUser(user) {
        await user.save();
        return UserModel.findById(user._id);
    }

    static delete(limit_date) {
        return UserModel.deleteMany({ last_connection: { $lt: limit_date } });
    }

    static deleteById(uid) {
        return UserModel.deleteOne({ _id: uid });
    }
}