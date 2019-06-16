const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema(
  {
    name: {
      type: mongoose.SchemaTypes.String,
      required: true,
      lowercase: true,
      trim: true
    },
    email: {
      type: mongoose.SchemaTypes.String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true
    },
    role: {
      type: mongoose.SchemaTypes.String,
      required: true,
      default: "user"
    },
    password: {
      type: mongoose.SchemaTypes.String,
      required: true
    }
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
