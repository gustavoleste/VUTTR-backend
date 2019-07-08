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
    if (!req.isAuth) {
      return res.status(401).json({ message: "Not Authenticate." });
    }
    const newReview = await new Reviews({ ...req.body });
    await newReview.save();
    return res.status(201).json(newReview);
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const updateReviewsByID = async (req, res) => {
  try {
    if (!req.isAuth) {
      return res.status(401).json({ message: "Not Authenticate." });
    }
    const review = await Reviews.findOne({ _id: req.params.reviewID });
    if (req.user.id == review.user || req.user.role === "admin") {
      const updatedReview = { ...req.body };
      await Reviews.updateOne({ _id: req.params.toolID }, updatedReview);
      return res.status(200).json(updatedReview);
    }
    return res.status(403).json({ msg: "Access not allowed" });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const filterReviewsByID = async (req, res) => {
  try {
    const params = getParams(req.params);
    const review = await Reviews.find(params);
    return res.status(200).json(review);
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const deleteReviewsByID = async (req, res) => {
  try {
    if (!req.isAuth) {
      return res.status(401).json({ message: "Not Authenticate." });
    }
    const review = await Reviews.findOne({ _id: req.params.reviewID });
    if (req.user.id == review.user || req.user.role === "admin") {
      const updatedReview = { ...req.body };
      await Reviews.deleteOne({ _id: req.params.toolID }, updatedReview);
      return res.status(200).json({});
    }
    return res.status(403).json({ msg: "Access not allowed" });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

module.exports = {
  createReviews,
  updateReviewsByID,
  filterReviewsByID,
  deleteReviewsByID
};
