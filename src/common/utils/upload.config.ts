
// import { BadRequestException, ForbiddenException } from '@nestjs/common';
// import multer, { diskStorage, Multer } from 'multer'
// import * as path from 'path'
// import * as fs from 'fs';

// const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
// const allowedFields = ['profile', 'signature'];

// function createUploadPath(fieldName: string) {
//     // const __filename = fileURLToPath(import.meta.url);
//     // const __dirname = dirname(__filename);
//     const folderPath = path.join(__dirname, '..', '..', 'public', 'uploads', fieldName);
//     if (!fs.existsSync(folderPath)) {
//         fs.mkdirSync(folderPath, { recursive: true });
//     }
//     return path.join('public', 'uploads', fieldName);
// }

// const storage = diskStorage({
//     destination: (req, file, cb) => {
//         console.log('file fieldname:', file.fieldname);
//         if (!allowedFields.includes(file.fieldname)) {
//             cb(new BadRequestException('Not allowed to upload this type of file'),'');
//         }
//         if (!allowedTypes.includes(file.mimetype)) {
//         cb(new BadRequestException('Not allowed to upload this type'),'');
//         }
//         const folderUploadPath = createUploadPath(file.fieldname);
//         cb(null, folderUploadPath);
//     },
//     filename: (req, file, cb) => {
//         const fileName = file.originalname.replace(/\s+/g, '_');
//         cb(null, fileName);
//     }
// });
// export const upload: Multer = multer({
//     storage,
//     fileFilter(req, file: Express.Multer.File, cb: multer.FileFilterCallback) {
//         const allowedTypes = ['image/jpeg', 'image/png'];
//         const allowedExtensions = ['jpg', 'png'];
//         const fileExt = file.originalname.split('.').pop();
//         if (!allowedExtensions.includes(fileExt??'')) {
//             cb(new BadRequestException('Not allowed to upload this type'));
//         } else {
//             cb(null, true);
//         }
//     }
// });

// export const formBody = multer().none();

import multer, { diskStorage, Options } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { BadRequestException } from '@nestjs/common';

const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
const allowedFields = ['profile', 'signature'];

function createUploadPath(fieldName: string) {
    const folderPath = path.join(process.cwd(), 'public', 'uploads', fieldName);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
    return folderPath;
}

export const multerOptions: Options = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            if (!allowedFields.includes(file.fieldname)) {
                cb(new BadRequestException('Invalid field'), '');
                return;
            }
            if (!allowedTypes.includes(file.mimetype)) {
                cb(new BadRequestException('Invalid mimetype'), '');
                return;
            }
            const folderUploadPath = createUploadPath(file.fieldname);
            cb(null, folderUploadPath);
        },
        filename: (req, file, cb) => {
            console.log('log from file upload')
            console.log(req.user)
            const fileName = file.originalname.replace(/\s+/g, '_');
            cb(null, fileName);
        },
    }),
    fileFilter(req, file, cb) {
        const allowedExtensions = ['jpg', 'png'];
        const fileExt = file.originalname.split('.').pop();
        if (!allowedExtensions.includes(fileExt ?? '')) {
            cb(new BadRequestException('Invalid extension'));
        } else {
            cb(null, true);
        }
    },
};
