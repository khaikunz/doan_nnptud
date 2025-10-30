const Upload = require("../models/upload.js");
const path = require("path");

// 📤 Tạo mới upload (upload file)
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng chọn file để upload" });
    }

    const newUpload = new Upload({
      filePath: req.file.path,
      fileType: req.file.mimetype,
      uploadedBy: req.user.id, // lấy từ token
    });

    await newUpload.save();
    res.status(201).json({ message: "Upload file thành công", upload: newUpload });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi upload file", error });
  }
};

// 📂 Lấy tất cả file (Admin thấy tất cả, user chỉ thấy của mình)
exports.getAllUploads = async (req, res) => {
  try {
    let uploads;
    if (req.user.role === "admin") {
      uploads = await Upload.find({ isDeleted: false }).populate("uploadedBy", "username role");
    } else {
      uploads = await Upload.find({ uploadedBy: req.user.id, isDeleted: false });
    }
    res.status(200).json(uploads);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách file", error });
  }
};

// 🔍 Lấy file theo ID
exports.getUploadById = async (req, res) => {
  try {
    const upload = await Upload.findOne({ _id: req.params.id, isDeleted: false }).populate("uploadedBy", "username role");
    if (!upload) return res.status(404).json({ message: "Không tìm thấy file" });

    // user chỉ được xem file của chính mình (trừ admin)
    if (req.user.role !== "admin" && upload.uploadedBy._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Bạn không có quyền xem file này" });
    }

    res.status(200).json(upload);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy file", error });
  }
};

// 🗑️ Xóa mềm file
exports.softDeleteUpload = async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) return res.status(404).json({ message: "Không tìm thấy file" });

    // chỉ cho phép admin hoặc người upload xóa
    if (req.user.role !== "admin" && upload.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Bạn không có quyền xóa file này" });
    }

    upload.isDeleted = true;
    await upload.save();

    res.status(200).json({ message: "Xóa mềm file thành công", upload });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa file", error });
  }
};

// 🔁 Khôi phục file (chỉ admin)
exports.restoreUpload = async (req, res) => {
  try {
    const upload = await Upload.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false },
      { new: true }
    );
    if (!upload) return res.status(404).json({ message: "Không tìm thấy file để khôi phục" });
    res.status(200).json({ message: "Khôi phục file thành công", upload });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi khôi phục file", error });
  }
};
