const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");

router.get("/login", authController.login_get);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
  })
);

const ensureAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) return next();
  else res.redirect("/user/login");
};

router.get("/register", authController.register_get);
router.post("/register", authController.register_post);
router.get("/logout", authController.logout);
router.get(
  "/membership/member",
  ensureAuthentication,
  authController.member_get
);
router.post(
  "/membership/member",
  ensureAuthentication,
  authController.member_post
);
router.get("/membership/admin", ensureAuthentication, authController.admin_get);
router.post(
  "/membership/admin",
  ensureAuthentication,
  authController.admin_post
);

module.exports = router;
