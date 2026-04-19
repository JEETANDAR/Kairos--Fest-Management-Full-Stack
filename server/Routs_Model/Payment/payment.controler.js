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

const sendEmail = require("../../utils/sendEmail");
const OrderNo = require("../../schema/Payment/orderNO.schema");

const {
  Razorpay_key,
  Razorpay_secret,
} = require("../../utils/environmentalVariables");

const OFFER_DEADLINE = new Date("2026-04-24T23:59:59");

const razorpay = new Razorpay({
  key_id: Razorpay_key,
  key_secret: Razorpay_secret,
});

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPER — create Razorpay order + save to DB
// ─────────────────────────────────────────────────────────────────────────────
async function generateOrder(paymentMethod, totalAmount, emailIdAndKey, participantsEmails) {
  try {
    const { orderNo } = await generateOrderNo(emailIdAndKey, paymentMethod, participantsEmails);

    const receiptNo = `Kairos_${orderNo}_${DateTime.now().toMillis()}`;

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
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

// ─────────────────────────────────────────────────────────────────────────────
// CREATE ORDER
// Called for BOTH cash & online when user hits "Proceed to Pay"
// For cash  → creates order + sends email immediately
// For online → creates order only, email is sent later via confirmOnlinePayment
// ─────────────────────────────────────────────────────────────────────────────
async function generateOrderDetails(req, res) {
  try {
    const user = await checkUserSessionInfo(req.session);

    if (!user) {
      return res.status(401).json({ message: "User not logged in" });
    }

    const { paymentMethod, eventsValues, isContingentSelection, finalAmount } = req.body;

    if (!eventsValues || typeof eventsValues !== "object") {
      return res.status(400).json({ message: "Invalid event data" });
    }

    let flattenEmails = {};
    let allEmails = [];
    let allParticipants = [];
    let rawTotal = 0;

    for (const event of Object.keys(eventsValues)) {
      const { amt, maximumNoOfParticipants } =
        await getAmountAndMinimumNoOfParticipants(event);

      const teamsForEvent = Object.values(eventsValues[event]);

      for (let team of teamsForEvent) {
        if (team.length > maximumNoOfParticipants) {
          return res.status(400).json({ message: "Max participants exceeded" });
        }
      }

      const participantsForEvent = teamsForEvent.flat();

      const emailsForEvent = participantsForEvent.map((p) =>
        (p.email || p.emailID || "").toLowerCase()
      );

      rawTotal += amt * teamsForEvent.length;

      flattenEmails[event] = emailsForEvent;
      allEmails.push(...emailsForEvent);

      participantsForEvent.forEach((p) => {
        allParticipants.push({
          email: (p.email || p.emailID || "").toLowerCase(),
          name: p.name || "",
          phone: p.phone || p.phoneNo || "",
          college: p.college || p.collegeName || "",
        });
      });
    }

    await bulkUserCheckIn(allParticipants);

    let totalAmount;
    const now = new Date();
    const offerActive = now <= OFFER_DEADLINE;

    if (offerActive && typeof finalAmount === "number" && finalAmount > 0) {
      totalAmount = finalAmount;
    } else {
      totalAmount = rawTotal;
    }

    const order = await generateOrder(paymentMethod, totalAmount, flattenEmails, allEmails);

    // ─── CASH: send confirmation email right away ─────────────────────────
    if (paymentMethod === "cash") {
      console.log("🔥 CASH PAYMENT — SENDING EMAIL NOW");

      if (allEmails.length > 0) {
        sendEmail({
          name: user.name,
          email: allEmails[0],
          events: flattenEmails,
          orderNo: order.orderNo,
          paymentMethod: "cash",
          college: user.collegeName,
          participants: allParticipants,
        }).catch((err) => console.error("❌ Cash Email failed:", err));
      } else {
        console.error("❌ No emails found for cash payment");
      }
    }

    // ─── ONLINE: return order details — email sent when user confirms ─────
    return res.status(200).json(order);

  } catch (err) {
    console.error("GenerateOrderDetails Error:", err);
    return res.status(500).json({ message: "Order failed" });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIRM ONLINE PAYMENT  ← NEW ENDPOINT
//
// Called from the frontend when the user clicks
// "✓ I've Completed the Payment" button.
//
// Body expected:
//   {
//     orderNo:      number,
//     participants: [ { name, email, phone, college }, ... ],
//     events:       { eventName: [emails], ... }
//   }
// ─────────────────────────────────────────────────────────────────────────────
async function confirmOnlinePayment(req, res) {
  try {
    const user = await checkUserSessionInfo(req.session);

    if (!user) {
      return res.status(401).json({ message: "User not logged in" });
    }

    const { orderNo, participants, events } = req.body;

    if (!orderNo) {
      return res.status(400).json({ message: "Missing orderNo" });
    }

    if (!participants || participants.length === 0) {
      return res.status(400).json({ message: "No participants provided" });
    }

    const allEmails = participants.map((p) => p.email).filter(Boolean);

    if (allEmails.length === 0) {
      return res.status(400).json({ message: "No valid emails in participants" });
    }

    console.log("🔥 ONLINE PAYMENT CONFIRMED — SENDING EMAIL for orderNo:", orderNo);

    // ✅ Send email with paymentMethod = "online"
    sendEmail({
      name: user.name,
      email: allEmails[0],
      events: events,
      orderNo: orderNo,
      paymentMethod: "online",
      college: user.collegeName,
      participants: participants,
    }).catch((err) => console.error("❌ Online Email failed:", err));

    return res.status(200).json({ message: "Confirmed — email sent" });

  } catch (err) {
    console.error("confirmOnlinePayment Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// VERIFY RAZORPAY SIGNATURE
// Only needed if you use Razorpay's own payment modal/webhook
// ─────────────────────────────────────────────────────────────────────────────
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
      status: "Payment Verified",
      orderNo: order.orderNo,
    });

  } catch (err) {
    console.error("Verify Signature Error:", err);
    return res.status(500).json({ status: "Server error" });
  }
}

module.exports = {
  generateOrderDetails,
  confirmOnlinePayment,  // ✅ new export
  verifySignature,
};