const Cart = require('../models/cart');
const Product = require('../models/product');

// 🟢 Tạo giỏ hàng mới (nếu user chưa có)
exports.createCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { products } = req.body; // [{ productId, quantity }]

    if (!products || !products.length) {
      return res.status(400).json({ message: 'Danh sách sản phẩm trống' });
    }

    // Kiểm tra nếu user đã có giỏ hàng
    let cart = await Cart.findOne({ userId, isDeleted: false });
    if (cart) {
      return res.status(400).json({ message: 'Người dùng đã có giỏ hàng' });
    }

    // Validate productId tồn tại và tính tổng tiền
    let total = 0;
    for (const item of products) {
      const product = await Product.findOne({ productId: item.productId });
      if (!product) {
        return res.status(400).json({ message: `Sản phẩm ${item.productId} không tồn tại` });
      }
      total += product.price * item.quantity;
    }

    const newCart = new Cart({ userId, products, total });
    await newCart.save();

    res.status(201).json({ message: 'Tạo giỏ hàng thành công', cart: newCart });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo giỏ hàng', error: error.message });
  }
};

// 🔵 Lấy giỏ hàng của user đang đăng nhập
exports.getMyCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId, isDeleted: false });
    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });

    // Lấy thông tin sản phẩm chi tiết
    const productsWithInfo = await Promise.all(
      cart.products.map(async item => {
        const product = await Product.findOne({ productId: item.productId });
        return {
          productId: item.productId,
          name: product?.name || null,
          price: product?.price || 0,
          image: product?.image || null,
          quantity: item.quantity
        };
      })
    );

    res.json({ ...cart._doc, products: productsWithInfo });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy giỏ hàng', error: error.message });
  }
};

// 🟡 Thêm hoặc cập nhật sản phẩm trong giỏ hàng
exports.updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'productId và quantity hợp lệ là bắt buộc' });
    }

    // Kiểm tra sản phẩm có tồn tại
    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(400).json({ message: `Sản phẩm ${productId} không tồn tại` });
    }

    let cart = await Cart.findOne({ userId, isDeleted: false });
    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });

    // Cập nhật sản phẩm trong giỏ
    const existing = cart.products.find(p => p.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    // Tính lại tổng tiền
    let total = 0;
    for (const item of cart.products) {
      const p = await Product.findOne({ productId: item.productId });
      total += p.price * item.quantity;
    }
    cart.total = total;

    await cart.save();
    res.json({ message: 'Cập nhật giỏ hàng thành công', cart });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật giỏ hàng', error: error.message });
  }
};

// 🗑️ Xóa mềm giỏ hàng (user hoặc admin)
exports.softDeleteCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // admin có thể xóa nhiều cách, nhưng endpoint hiện tại dùng token user -> xóa giỏ của chính user
    const cart = await Cart.findOneAndUpdate({ userId, isDeleted: false }, { isDeleted: true }, { new: true });
    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng để xóa' });

    res.json({ message: 'Xóa giỏ hàng thành công (soft delete)', cart });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa giỏ hàng', error: error.message });
  }
};



