const mongoose = require("mongoose");

const rolSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});
const Roles = mongoose.model("roles", rolSchema);
module.exports = Roles;
