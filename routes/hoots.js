const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const hootCtrl = require("../controllers/hoots.js");
const router = express.Router();

// ========== Public Routes ===========

// ========= Protected Routes =========

router.use(verifyToken);

router.get("/", hootCtrl.index);

router.get("/:hootId", hootCtrl.show);

router.post("/", hootCtrl.create);

router.put("/:hootId", hootCtrl.update);

router.delete("/:hootId", hootCtrl.delete);

router.post("/:hootId/comments", hootCtrl.createComment);

module.exports = router;
