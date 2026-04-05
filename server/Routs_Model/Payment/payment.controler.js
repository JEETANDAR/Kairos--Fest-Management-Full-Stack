const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const { DateTime } = require("luxon");

const { bulkUserCheckIn } = require("../../Data_Model/user.data");
const {
  generateOrderNo,
  addOrdersDetails,
} = require("../../Data_Model/Payment/payment.data");
const { getAmountAndMinimumNoOfParticipants } = require("../../Data_Model/events.data");
const { checkUserSessionInfo } = require("../../utils/userSessionRetrevial");
const OrdersSchema = require("../../schema/Payment/oders.schema");

const { Razorpay_key, Razorpay_secret } = require("../../utils/environmentalVariables");

const OFFER_DEADLINE = new Date("2026-04-24T23:59:59");

// Razorpay init
const razorpay = new Razorpay({
  key_id: Razorpay_key,
  key_secret: Razorpay_secret,
});

// -----------------------------
// ORDER GENERATION
// -----------------------------
async function generateOrder(paymentMethod, totalAmount, emailIdAndKey, participantsEmails) {
  try {
    const { orderNo, _id } = await generateOrderNo(emailIdAndKey, paymentMethod, participantsEmails);

    const receiptNo = `Kairos_${orderNo}_${DateTime.now().toMillis()}`;

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // paise
      currency: "INR",
      receipt: receiptNo,
      notes: emailIdAndKey,
    });

    await addOrdersDetails({
      orderNo,
      orderID: razorpayOrder.id,
      amount: totalAmount,
      paymentMethod,
    });

    return {
      orderNo,
      amount: totalAmount,
      razorpayOrderId: razorpayOrder.id,
    };
  } catch (err) {
    console.error("Order Generation Error:", err);
    throw err;
  }
}

// -----------------------------
// API: CREATE ORDER
// -----------------------------
async function generateOrderDetails(req, res) {
  try {
    const user = await checkUserSessionInfo(req.session);
    if (!user) {
      return res.status(401).json({ message: "User not logged in" });
    }

    // ⭐ Accept finalAmount from frontend (offer-applied price)
    const { paymentMethod, eventsValues, isContingentSelection, finalAmount } = req.body;

    if (!eventsValues || typeof eventsValues !== "object") {
      return res.status(400).json({ message: "Invalid event data" });
    }

    let flattenEmails = {};
    let allEmails = [];
    // Raw total used only for backend validation, not for charging
    let rawTotal = 0;

    for (const event of Object.keys(eventsValues)) {
      const { amt, maximumNoOfParticipants } = await getAmountAndMinimumNoOfParticipants(event);
      const teamsForEvent = Object.values(eventsValues[event]);

      console.log(`\n=== CHECKING EVENT: ${event} ===`);
      console.log(`Max allowed from DB:`, maximumNoOfParticipants);

      for (let i = 0; i < teamsForEvent.length; i++) {
        const team = teamsForEvent[i];
        console.log(`Team ${i + 1} size:`, team.length);

        if (team.length > maximumNoOfParticipants) {
          console.log(`❌ Team size (${team.length}) > DB max (${maximumNoOfParticipants})`);
          return res.status(400).json({ message: "Max participants exceeded" });
        }
      }

      const participants = teamsForEvent
        .flat()
        .map((p) => p.email.toLowerCase());

      rawTotal += amt * teamsForEvent.length;

      flattenEmails[event] = participants;
      allEmails.push(...participants);

      await bulkUserCheckIn(participants);
    }

    // ─── AMOUNT RESOLUTION ────────────────────────────────────────────────────
    // Priority:
    //   1. If frontend sent a finalAmount AND it's before the deadline → trust it
    //      (offer logic lives in the frontend and has been validated there)
    //   2. If contingent is flagged AND before deadline → ₹2600 (safety net)
    //   3. Otherwise → use rawTotal from DB prices (no offer)

    let totalAmount;
    const now = new Date();
    const offerActive = now <= OFFER_DEADLINE;

    if (offerActive && typeof finalAmount === "number" && finalAmount > 0) {
      // Basic sanity check: finalAmount should never be MORE than raw total
      if (finalAmount > rawTotal) {
        console.warn(
          `⚠️  Frontend finalAmount (${finalAmount}) > rawTotal (${rawTotal}). Falling back to rawTotal.`
        );
        totalAmount = rawTotal;
      } else {
        // Trust the frontend offer-applied price
        totalAmount = finalAmount;
      }
    } else if (offerActive && isContingentSelection) {
      totalAmount = 2600;
    } else {
      totalAmount = rawTotal;
    }

    console.log(`\n💰 Charging: ₹${totalAmount} (raw would be ₹${rawTotal})`);

    const order = await generateOrder(
      paymentMethod,
      totalAmount,
      flattenEmails,
      allEmails
    );

    return res.status(200).json(order);
  } catch (err) {
    console.error("GenerateOrderDetails Error:", err);
    return res.status(500).json({ message: "Order failed" });
  }
}

// -----------------------------
// VERIFY PAYMENT
// -----------------------------
async function verifySignature(req, res) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ status: "Missing payment details" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", Razorpay_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ status: "Invalid signature" });
    }

    const order = await OrdersSchema.findOne({ orderID: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ status: "Order not found" });
    }

    order.status = true;
    await order.save();

    return res.status(200).json({
      status: "Payment Successful",
      orderNo: order.orderNo,
    });
  } catch (err) {
    console.error("Verify Error:", err);
    return res.status(500).json({ status: "Server error" });
  }
}

module.exports = {
  generateOrderDetails,
  verifySignature,
};