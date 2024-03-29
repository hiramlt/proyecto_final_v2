import UsersService from '../services/users.service.js';
import EmailService from '../services/email.service.js';
import CustomError from '../utils/errors.js';

export default class UsersController {
    static get() {
        return UsersService.get();
    }

    static async delete() {
        let date = new Date(Date.now() - (1000 * 60 * 60 * 48));

        const users = await UsersService.get({ last_connection: { $lt: date } });
        if (users && users.length > 0) {
            for (const user of users) {
                await EmailService.sendAccountDeleteNotification(user)
            }
        }

        return UsersService.delete(date.toISOString());
    }

    static async deleteById(uid) {
        const user = UsersService.getById(uid);
        if (!user) {
            CustomError.create({ name: 'Not found', message: 'No se encontro el usuario', code: 5 })
        }
        
        return UsersService.deleteById(uid);
    }

    static async updateRole(uid) {
        const user = await UsersService.getById(uid);
        if (!user) {
            CustomError.create({ name: 'Not found', message: 'No se encontro el usuario', code: 5 })
        }
        if (user.documents.length === 0) {
            CustomError.create({ name: 'Unauthorized', message: 'Faltan documentos necesarios para actualizar rol', code: 6 })
        }

        const required_docs = ['ID', 'residency_file', 'billing_file']
        const user_docs = user.documents.map(doc => doc.name);
        const hasRequiredDocs = required_docs.every(doc => user_docs.includes(doc));
        
        if (user.role === 'user' && !hasRequiredDocs) {
            CustomError.create({ name: 'Unauthorized', message: 'Faltan documentos necesarios para actualizar rol', code: 6 })
        }

        const newRole = user.role === 'user' ? 'premium' : 'user'
        await UsersService.update(uid, { role: newRole });
        return UsersService.getById(uid);
    }

    static async uploadDocuments(uid, documents) {
        if (!documents) {
            CustomError.create({ name: 'Invalid data', message: 'Agregue los documentos solicitados', code: 4 })
        }
        const user = await UsersService.getById(uid);
        if (!user) {
            CustomError.create({ name: 'Not found', message: 'No se encontro el usuario', code: 5 })
        }
        
        const list_documents = Object.keys(documents)
        for(const doc of list_documents) {
            const file_path = documents[doc][0].destination.split('\\')
            await UsersService.addDocuments(user._id, { 
                name: documents[doc][0].fieldname, 
                reference: `/${file_path[file_path.length -1]}/${documents[doc][0].filename}` 
            })
        }

        return UsersService.getById(uid)
    }
}