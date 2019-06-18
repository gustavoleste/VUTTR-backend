const { Reviews } = require("../../database/index");

const getParams = params => {
  if (params.reviewID) {
    return {
      _id: params.reviewID
    };
  }
  if (params.userID) {
    return {
      user: params.userID
    };
  }
  if (params.toolID) {
    return {
      tool: params.toolID
    };
  } else {
    return null;
  }
};

const createReviews = async (req, res) => {
  try {
    const newReview = await new Reviews({ ...req.body });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    throw err;
  }
};

const updateReviewsByID = async (req, res) => {
  try {
    const id = req.params.reviewID;
    const updatedReview = { ...req.body };
    await Reviews.updateOne({ _id: id }, updatedReview);
    res.status(200).json(updatedReview);
  } catch (err) {
    throw err;
  }
};

const filterReviewsByID = async (req, res) => {
  try {
    const params = getParams(req.params);
    const review = await Reviews.findOne(params);
    res.status(200).json(review);
  } catch (err) {
    throw err;
  }
};

const deleteReviewsByID = async (req, res) => {
  try {
    const id = req.params.reviewID;
    await Reviews.deleteOne({ _id: id });
    res.status(200).json({});
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createReviews,
  updateReviewsByID,
  filterReviewsByID,
  deleteReviewsByID
};
