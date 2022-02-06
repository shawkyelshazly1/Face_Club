const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

const ensuerAdminAccess = function (req, res, next) {
  if (req.user.is_admin) return next();
  else res.redirect("/");
};

router.get("/", messageController.message_get);
router.post("/", messageController.message_post);
router.get("/:id/delete", ensuerAdminAccess, messageController.message_delete);

module.exports = router;
