const Item = require("../models/Item");
const parseVErr = require("../utils/parseValidationErrs");

const getAllItems = async (req, res) => {
  const userId = req.user._id;
  const items = await Item.find({ createdBy: userId }).sort("createdAt").lean();

  const lowStockItems = items.filter((item) => item.quantity <= 5);

  if (lowStockItems.length > 0) {
    const lowMsg =
      "The following items are low in stock: " +
      lowStockItems.map((item) => item.name);
    if (res.locals.info && res.locals.info.length) {
      res.locals.info.push(lowMsg);
    } else {
      res.locals.info = [lowMsg];
    }
  }

  res.render("items", { items });
};
const createItem = async (req, res) => {
  req.body.createdBy = req.user._id;

  try {
    const userItems = await Item.find({ createdBy: req.user._id });
    const nameTakenItem = userItems.filter(
      (item) => item.name === req.body.name,
    );

    if (nameTakenItem.length >= 1) {
      req.flash("error", "Item name is already being used in this account.");
      res.redirect("/items/new");
    } else {
      const userItem = await Item.create(req.body);
      req.flash("info", "Item successfully added to database.");
      res.redirect("/items");
      res.render("item", {
        errors: req.flash("errors"),
        info: req.flash("info"),
      });
    }
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
      res.redirect("/items/new");
    } else {
      return next(e);
    }
  }
};
const updateItem = async (req, res) => {
  const {
    params: { id: itemId },
    body: { name, description, quantity, category },
  } = req;
  const userId = req.user._id;

  const userItems = await Item.find({ createdBy: userId });
  const nameTakenItem = userItems.filter((item) => item.name === name);

  if (nameTakenItem.length >= 1) {
    req.flash("error", "Item name is already being used in this account.");
    return res.redirect("/items/edit/" + itemId);
  }
  if (!name && !description && !quantity && !category) {
    req.flash(
      "error",
      "At least one of the following must be present: name, description, quantity and category.",
    );
  }
  const itemUpdateData = {};
  if (name) {
    itemUpdateData.name = name;
  }
  if (description) {
    itemUpdateData.description = description;
  }
  if (quantity) {
    itemUpdateData.quantity = quantity;
  }
  if (category) {
    itemUpdateData.category = category;
  }
  try {
    const item = await Item.findByIdAndUpdate(
      { _id: itemId, createdBy: userId },
      itemUpdateData,
      { new: true, runValidators: true },
    );
    if (!item) {
      req.flash("error", `There's no item with id ${itemId}.`);
    }
    res.redirect("/items");
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
    } else {
      next(e);
    }
    res.redirect("/items/new");
    res.render("item", {
      errors: req.flash("errors"),
      info: req.flash("info"),
    });
  }
};
const deleteItem = async (req, res) => {
  const {
    params: { id: itemId },
  } = req;
  const userId = req.user._id;

  const item = await Item.findByIdAndDelete({ createdBy: userId, _id: itemId });
  if (!item) {
    req.flash("error", `There was no item with id ${itemId}.`);
  } else {
    req.flash("info", `Item "${item.name}" succesfully deleted.`);
  }
  res.redirect("/items");
};
const getNewItemForm = (req, res) => {
  res.render("item", { item: null });
};
const getItemToEdit = async (req, res) => {
  const {
    params: { id: itemId },
  } = req;
  const userId = req.user._id;
  const item = await Item.findOne({ createdBy: userId, _id: itemId });
  if (!item) {
    req.flash("error", `There was no item with id ${itemId}.`);
    return res.redirect("/items");
  }
  res.render("item", { item });
};
module.exports = {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
  getNewItemForm,
  getItemToEdit,
};
