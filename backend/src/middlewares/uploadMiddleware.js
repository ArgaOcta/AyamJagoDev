const multer = require("multer");
const path = require("path");

// storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// filter file (hanya gambar)
const fileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());

  if (ext) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  }
});

module.exports = upload;