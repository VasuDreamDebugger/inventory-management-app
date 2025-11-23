const express = require('express');
const productsController = require('../controllers/productsController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const {
  validateProductCreate,
  validateProductUpdate,
  handleValidation,
} = require('../middleware/validation');

const router = express.Router();

router.get('/', productsController.getProducts);
router.get('/categories', productsController.getCategories);
router.post(
  '/',
  authMiddleware,
  validateProductCreate,
  handleValidation,
  productsController.createProduct
);
router.put(
  '/:id',
  authMiddleware,
  validateProductUpdate,
  handleValidation,
  productsController.updateProduct
);
router.delete('/:id', authMiddleware, productsController.deleteProduct);
router.get('/:id/history', authMiddleware, productsController.getProductHistory);
router.post(
  '/import',
  authMiddleware,
  upload.single('csvFile'),
  productsController.importProducts
);
router.get('/export', authMiddleware, productsController.exportProducts);
router.get('/statistics', authMiddleware, productsController.getStatistics);

module.exports = router;

