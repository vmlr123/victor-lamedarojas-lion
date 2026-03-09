const router = require("express").Router();

const {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
  getNewItemForm,
  getItemToEdit,
} = require("../controllers/items");

router.route("/").get(getAllItems).post(createItem);
router.route("/new").get(getNewItemForm);
router.route("/edit/:id").get(getItemToEdit);
router.route("/update/:id").post(updateItem);
router.route("/delete/:id").post(deleteItem);
module.exports = router;
