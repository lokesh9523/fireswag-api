
import * as multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/svg+xml') {
    cb(null, true);
  } else {
    cb(new Error('Not supported'), false);
  }
};

export const imageUpload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // 10 Mb
  fileFilter: fileFilter
})
  .single('uploadImage');