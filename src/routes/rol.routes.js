const router = require("express").Router();
const rolSchema = require("../database/models/roles.model");

router.get("/", async (req, res) => {
  const roles = await rolSchema.find();
  res.json({ roles });
});
module.exports = router;