const jwt = require("jsonwebtoken");
const { secretjwt } = require("../../config/config");
function generateAcessToken(user) {
  return jwt.sign({ id: user._id }, secretjwt, { expiresIn: 86400 });
}
module.exports = generateAcessToken;
