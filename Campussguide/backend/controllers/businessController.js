const Business = require('../models/Business');

const getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({});
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTopRatedBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({}).sort({ averageRating: -1 }).limit(5);
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (business) {
      res.json(business);
    } else {
      res.status(404).json({ message: 'Business not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBusiness = async (req, res) => {
  try {
    const { name, category, location, description, contactInfo, imageUrl, lat, lng } = req.body;
    const business = new Business({
      name,
      category,
      location,
      lat,
      lng,
      description,
      contactInfo,
      imageUrl,
      claimedBy: req.user._id,
    });

    const createdBusiness = await business.save();
    res.status(201).json(createdBusiness);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBusinesses, getTopRatedBusinesses, getBusinessById, createBusiness };
