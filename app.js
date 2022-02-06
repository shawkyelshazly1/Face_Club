const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
require("dotenv").config();
const engine = require("ejs-blocks");
const passport = require("passport");
var bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");

const app = express();
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  () => {
    console.log(`MongoDB Connected Succesfully.`);
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, `MongoDB Connection Error!`));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", engine);
app.set("view engine", "ejs");

require("./config/passport")(passport);

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(compression());

app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT;

const ensureAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) return next();
  else res.redirect("/user/login");
};

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const messageRouter = require("./routes/message");

app.use("/", indexRouter);
app.use("/user", authRouter);
app.use(ensureAuthentication);
app.use("/message", messageRouter);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
