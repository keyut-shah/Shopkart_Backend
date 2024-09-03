import express from 'express';
import { createProduct } from '../controllers/productController.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';
import { updateProduct } from '../controllers/productController.js';
import { getProductById } from '../controllers/productController.js';
import { deleteProduct } from '../controllers/productController.js';
const router = express.Router();
router.post("/add_product",protect ,upload.array('images',5), createProduct);
router.put('/:productId', protect, upload.array('images', 12), updateProduct);
router.get('/:productId', protect, getProductById);
router.delete('/:productId', protect, deleteProduct);


export default router;
