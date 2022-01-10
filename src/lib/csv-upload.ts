
import * as multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'csv')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  console.log(file.mimetype)
  if (file.mimetype === 'application/vnd.ms-excel' || file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.mimetype.match(/csv\/*/) || file.mimetype.match(/excel\/*/) !== null) {
    cb(null, true);
  } else {
    cb(new Error('Not supported'), false);
  }
};

export const csvUpload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // 10 Mb
  fileFilter: fileFilter
});