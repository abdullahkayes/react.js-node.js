import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.pdf') {
      return cb(new Error('Only image and pdf files are allowed'), false);
    }
    cb(null, true);
  },
});

/**
 * Upload instance for the Upload Document modal, which allows a larger file
 * than the rest of the application.
 *
 * This deliberately does not change `upload` above: every other upload in the
 * application - registration, the three request flows, item attachments - goes
 * through that instance, and loosening its limit to suit one form would silently
 * raise the ceiling on all of them. Anything about to be certified to a customer,
 * a carrier or a customs broker is worth the larger allowance, so the limit here
 * is the one the form states.
 *
 * The accepted extensions are the same four, which is what the modal tells staff
 * and what it enforces on both sides.
 */
const DOCUMENT_MAX_BYTES = 10 * 1024 * 1024;
const DOCUMENT_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf'];

const uploadDocument = multer({
  storage,
  limits: { fileSize: DOCUMENT_MAX_BYTES },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!DOCUMENT_EXTENSIONS.includes(ext)) {
      return cb(new Error('Only PDF, JPG, JPEG and PNG files can be uploaded'), false);
    }
    cb(null, true);
  },
});

export { DOCUMENT_MAX_BYTES, DOCUMENT_EXTENSIONS };
export default upload;
export { uploadDocument };
