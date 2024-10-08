// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

const mongoose = require("mongoose");
const Schema = mongoose.Schema


const listingSchema = new Schema({
  user: {
    type: String, // Assuming your user information is stored as a string
    required: true
  },
  title: {
    type: String,
    default: "Default Title" // Replace "Default Title" with the actual default value
  },
  description: {
    type: String,
    default: "Default Description" // Replace "Default Description" with the actual default value
  },
  startDate: {
    type: Date,
    default: Date.now // Replace Date.now with the actual default value
  },
  endDate: {
    type: Date,
    default: Date.now // Replace Date.now with the actual default value
  },
  time: {
    type: String,
    default: "Default Time" // Replace "Default Time" with the actual default value
  },
  tags: {
    type: String,
    default: "Default Tags" // Replace "Default Tags" with the actual default value
  },
  reminder: {
    type: String,
    default: "Default Reminder" // Replace "Default Reminder" with the actual default value
  }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
