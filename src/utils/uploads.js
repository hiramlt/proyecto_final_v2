import path from 'path'
import multer from 'multer'
import { __dirname } from '../utils.js' 
import CustomError from './errors.js'

const allowedFilesMimeTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf'
]

export const uploadFile = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        let folder = ''
        if (file.fieldname === 'ID' || file.fieldname === 'residency_file' || file.fieldname === 'billing_file'){
          folder = 'documents'
        }
        if (file.fieldname === 'profile') {
          folder = 'profiles'
        }
        if (file.fieldname === 'thumbnails') {
          folder = 'products'
        }
        cb(null, path.join(__dirname, '../public', folder))
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname.replaceAll(' ', ''))
      }
    }),
    limits: {
      fieldSize: 10000000
    },
    fileFilter: (req, file, cb) => {
      if (allowedFilesMimeTypes.includes(file.mimetype)) {
        cb(null, true)
      } else {
        cb(CustomError.create({ name: 'Invalid type', message: 'Formato de archivo no valido', code: 2 }))
      }
    }
  })