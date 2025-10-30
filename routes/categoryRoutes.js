const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, isAdmin } = require('../middlewares/auth.js');

// 🔵 Xem tất cả danh mục (public)
router.get('/', categoryController.getAllCategories);

// 🔵 Xem 1 danh mục
router.get('/:id', categoryController.getCategoryById);

// 🟢 Thêm danh mục (admin)
router.post('/', verifyToken, isAdmin, categoryController.createCategory);

// 🔴 Xóa mềm (admin)
router.delete('/:id', verifyToken, isAdmin, categoryController.softDeleteCategory);


module.exports = router;
