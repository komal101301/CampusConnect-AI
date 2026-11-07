const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    course: {
      type: String,
      required: true,
    },

    graduationYear: {
      type: String,
      required: true,
    },

    college: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    tipTokens: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Student",
  studentSchema
);