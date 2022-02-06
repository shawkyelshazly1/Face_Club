const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const moment = require("moment");

router.get("/", (req, res, next) => {
  Message.find({})
    .populate("author")
    .exec(function (err, messages) {
      if (err) {
        return next(err);
      }
      res.render("home_page", {
        title: "Face Club - Homepage",
        messages: messages,
        moment: moment,
      });
    });
});

module.exports = router;
