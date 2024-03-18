import UsersService from '../services/users.service.js';
import CustomError from '../utils/errors.js';

export default class UsersController {
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

        return await UsersService.getById(uid)
    }
}