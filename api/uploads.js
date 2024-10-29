const express = require("express");
const router = express.Router();
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const uploads = await prisma.track.findMany();
    res.json(uploads);
  } catch (e) {
    next(e);
  }
});
