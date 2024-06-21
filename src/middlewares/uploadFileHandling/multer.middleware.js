import multer from "multer";
import path from "path";

const imageFolderPath = path.join(path.resolve(), "src", "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageFolderPath);
  },
  filename: (req, file, cb) => {
    const fileName =
      Date.now() +
      "_" +
      Math.round(Math.random() * 1e9) +
      "_" +
      file.originalname;
    cb(null, fileName);
  },
});

export const upload = multer({ storage: storage });
