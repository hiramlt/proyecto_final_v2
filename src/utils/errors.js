export default class CustomError {
    static create({ name, message, code = 1 }) {
        const error = new Error(message);
        error.name = name;
        error.code = code;
        throw error;
    }
}