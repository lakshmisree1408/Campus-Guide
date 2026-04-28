const Review = require('../models/Review');
const Business = require('../models/Business');

const addReview = async (req, res) => {
  try {
    const { businessId, rating, reviewText } = req.body;

    const review = new Review({
      user: req.user._id,
      business: businessId,
      rating,
      reviewText,
    });

    const createdReview = await review.save();

    // Update business average rating
    const reviews = await Review.find({ business: businessId });
    const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
    const averageRating = totalRating / reviews.length;

    const business = await Business.findById(businessId);
    business.averageRating = averageRating;
    await business.save();

    res.status(201).json(createdReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBusinessReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ business: req.params.businessId }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addReview, getBusinessReviews };
