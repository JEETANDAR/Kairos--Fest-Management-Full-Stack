import axios from "axios";
import URL from "./serverURL_link";

/**
 * CREATE ORDER (Cash / Online)
 */
const proceedToPay = async (
  participants,
  isCashPayment,
  isContingentSelection
) => {
  try {
    const paymentMethod = isCashPayment ? "cash" : "online";

    const payload = {
      paymentMethod,
      eventsValues: participants,
      isContingentSelection,
    };

    const response = await axios.post(
      `${URL}payment/orders`,
      payload,
      {
        withCredentials: true, // 🔥 VERY IMPORTANT
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ proceedToPay error:", error?.response?.data || error);
    throw error;
  }
};

/**
 * VERIFY RAZORPAY PAYMENT
 */
const validatePayment = async (responseData) => {
  try {
    const response = await axios.post(
      `${URL}payment/verifyOrder`,
      responseData,
      {
        withCredentials: true, // 🔥 KEEP SESSION CONSISTENT
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ validatePayment error:", error?.response?.data || error);
    throw error;
  }
};

export { proceedToPay, validatePayment };
