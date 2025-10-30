const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");
const { verifyToken, isAdmin } = require("../middlewares/auth.js");
const multer = require("multer");
const path = require("path");

// ⚙️ Cấu hình multer để lưu file vào thư mục uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.post("/", verifyToken, upload.single("file"), uploadController.uploadFile);
router.get("/", verifyToken, uploadController.getAllUploads);
router.get("/:id", verifyToken, uploadController.getUploadById);
router.delete("/:id", verifyToken, uploadController.softDeleteUpload);
router.patch("/restore/:id", verifyToken, isAdmin, uploadController.restoreUpload);

module.exports = router;
