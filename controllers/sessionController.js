const User = require("../models/User");
const parseVErr = require("../utils/parseValidationErrs");
const passport = require("passport");

const registerShow = (req, res) => {
  res.render("register");
};

const registerDo = async (req, res, next) => {
  if (req.body.password != req.body.password1) {
    req.flash("error", "The passwords entered do not match.");
    res.redirect("/sessions/register");
    return res.render("register", { errors: req.flash("errors") });
  }
  try {
    const user = await User.create(req.body);
    req.login(user, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      req.flash("error", "That email address is already registered.");
    } else {
      return next(e);
    }
    res.redirect("/sessions/register");
    return res.render("register", { errors: req.flash("errors") });
  }
};

const logoff = (req, res) => {
  const csrf = require("host-csrf");
  csrf.clearToken(req, res);
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
};

const logonShow = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("logon");
};

module.exports = {
  registerShow,
  registerDo,
  logoff,
  logonShow,
};
