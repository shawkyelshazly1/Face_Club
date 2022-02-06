const passport = require("passport");

const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");

exports.login_get = (req, res, next) => {
  res.render("login_form", { title: "Face Club - Login", user: req.user });
};

exports.login_post = passport.authenticate("local", {
  successRedirect: "/user/login",
  failureRedirect: "/",
});

exports.register_get = (req, res, next) => {
  res.render("register_form", { title: "Face Club - Register" });
};
exports.register_post = [
  body("first_name").trim().escape().isLength({ min: 1 }),
  body("last_name").trim().escape().isLength({ min: 1 }),
  body("username").trim().escape().isLength({ min: 1 }),
  body("email").trim().escape().isLength({ min: 1 }).isEmail(),
  body("confirm_password").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation doesn't match.");
    }
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("register_form", { title: "Face Club - Register" });
      return;
    } else {
      bcryptjs.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {
          return next(err);
        }
        const user = new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          username: req.body.username,
          password: hashedPassword,
        }).save((err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/user/login");
        });
      });
    }
  },
];

exports.logout = (req, res, next) => {
  req.logout();
  res.redirect("/");
};

exports.member_get = (req, res, next) => {
  if (req.user.is_member || req.user.is_admin) {
    res.redirect("/");
  } else {
    res.render("become_member", { title: "Face Club - Become A Member" });
  }
};

exports.member_post = [
  body("password").trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("become_member", {
        title: "Face Club - Become A Member",
        errors: errors.array,
      });
      return;
    }
    if (req.body.password === process.env.MEMBER_PASSWORD) {
      User.findOneAndUpdate({ _id: req.user._id }, { is_member: true }).exec(
        function (err, user) {
          if (err) {
            return next(err);
          }
          console.log("Updated User:" + user);
          res.redirect("/");
        }
      );
    } else {
      res.redirect("/user/membership/member");
    }
  },
];

exports.admin_get = (req, res, next) => {
  if (req.user.is_admin) {
    res.redirect("/");
  } else {
    res.render("become_admin", { title: "Face Club - Become An Admin" });
  }
};

exports.admin_post = [
  body("password").trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("become_admin", {
        title: "Face Club - Become An Admin",
        errors: errors.array,
      });
      return;
    }
    if (req.body.password === process.env.ADMIN_PASSWORD) {
      User.findOneAndUpdate(
        { _id: req.user._id },
        { is_member: true, is_admin: true }
      ).exec(function (err, user) {
        if (err) {
          return next(err);
        }
        console.log("Updated User:" + user);
        res.redirect("/");
      });
    } else {
      res.redirect("/user/membership/admin");
    }
  },
];
