const express = require("express");
const router = express.Router();
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const playlists = await prisma.track.findMany();
    res.json(playlists);
  } catch (e) {
    next(e);
  }
});
