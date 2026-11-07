const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    jobTitle: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "Applied",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);