const express = require('express');
const router = express.Router();
const { getBusinesses, getTopRatedBusinesses, getBusinessById, createBusiness } = require('../controllers/businessController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getBusinesses).post(protect, createBusiness);
router.route('/top-rated').get(getTopRatedBusinesses);
router.route('/:id').get(getBusinessById);

module.exports = router;
