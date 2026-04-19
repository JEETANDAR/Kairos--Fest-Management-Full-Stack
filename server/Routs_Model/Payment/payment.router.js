const router = require("express").Router();
const {
  generateOrderDetails,
  verifySignature,
  confirmOnlinePayment,  // ✅ added
} = require("./payment.controler");

router.post("/orders", generateOrderDetails);
router.post("/verifyOrder", verifySignature);
router.post("/confirm-online", confirmOnlinePayment);  // ✅ added

module.exports = router;