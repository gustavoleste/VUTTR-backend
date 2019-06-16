const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewsSchema = new Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "users"
    },
    tool: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "tools"
    },
    comment: {
      type: mongoose.SchemaTypes.String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

const Reviews = mongoose.model("Reviews", reviewsSchema);

module.exports = Reviews;
