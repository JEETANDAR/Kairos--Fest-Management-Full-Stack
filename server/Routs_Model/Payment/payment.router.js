const router = require("express").Router();
const {
  generateOrderDetails,
  verifySignature,
} = require("./payment.controler");

router.post("/orders", generateOrderDetails);
router.post("/verifyOrder", verifySignature);

module.exports = router;
