const Item = require("../models/Item");
const parseVErr = require("../utils/parseValidationErrs");
const flash = require("connect-flash");

const getAllItems = async (req, res) => {
  const userId = req.user._id;
  const items = await Item.find({ createdBy: userId }).sort("createdAt");

  lowStockItems = items.filter((item) => item.quantity <= 5);
  if (lowStockItems.length > 0) {
    req.flash(
      "info",
      "The following items are low in stock: " +
        lowStockItems.map((item) => item.name).join(", "),
    );
  }

  res.render("items", { items });
};
const createItem = async (req, res) => {
  req.body.createdBy = req.user._id;
  try {
    const item = await Item.create(req.body);
    res.redirect("/items");
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
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
      return next(e);
    }
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
