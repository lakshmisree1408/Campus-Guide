const express = require('express');
const router = express.Router();
const { addReview, getBusinessReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, addReview);
router.route('/:businessId').get(getBusinessReviews);

module.exports = router;
