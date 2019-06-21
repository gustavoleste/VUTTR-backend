const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const toolsSchema = new Schema(
  {
    title: {
      type: mongoose.SchemaTypes.String,
      required: true,
      lowercase: true,
      trim: true
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "users"
    },
    link: {
      type: mongoose.SchemaTypes.String,
      required: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: mongoose.SchemaTypes.String,
      required: true,
      trim: true
    },
    tags: {
      type: [],
      required: true
    }
  },
  { timestamps: true }
);

const Tools = mongoose.model("Tools", toolsSchema);

module.exports = Tools;
