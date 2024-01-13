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
}