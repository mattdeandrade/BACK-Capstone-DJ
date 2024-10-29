const express = require("express");
const router = express.Router();
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const edits = await prisma.track.findMany();
    res.json(edits);
  } catch (e) {
    next(e);
  }
});
