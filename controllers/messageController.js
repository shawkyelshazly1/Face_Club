const { body, validationResult } = require("express-validator");
const Message = require("../models/message");

exports.message_get = (req, res, next) => {
  res.render("message_form", { title: "Face Club - Post A Message" });
};

exports.message_post = [
  body("content").trim().escape().isLength({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("message_form", {
        title: "Face Club - Post A Message",
        errors: errors.array(),
      });
      return;
    } else {
      const message = new Message({
        message: req.body.content,
        author: req.user._id,
      }).save((err) => {
        if (err) {
          return next(err);
        } else {
          res.redirect("/");
        }
      });
    }
  },
];

exports.message_delete = (req, res, next) => {
  Message.findOneAndDelete({ _id: req.params.id }).exec(function (
    err,
    message
  ) {
    if (err) {
      return next(err);
    }
    console.log("Deleted Message: " + message);
    res.redirect("/");
  });
};
