import UserModel from '../models/user.model.js';

export default class UserDao {
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
}