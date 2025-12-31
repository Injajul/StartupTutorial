import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempPath = path.join(__dirname, "../public/temp/");
if (!fs.existsSync(tempPath)) {
  fs.mkdirSync(tempPath, { recursive: true });
}

const sanitize = (str) => str.replace(/[^a-zA-Z0-9]/g, "_");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tempPath),
  filename: (req, file, cb) => {
    const name = sanitize(path.parse(file.originalname).name);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${name}_${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;