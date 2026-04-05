import axios from "axios";
import URL from "./serverURL_link";

const proceedToPay = async (
  participants,
  isCashPayment,
  isContingentSelection,
  finalAmount
) => {
  try {
    const paymentMethod = isCashPayment ? "cash" : "online";

    const payload = {
      paymentMethod,
      eventsValues: participants,
      isContingentSelection,
      finalAmount,
    };

    const response = await axios.post(
      `${URL}payment/orders`,
      payload,
      {
        withCredentials: true,
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

const validatePayment = async (responseData) => {
  try {
    const response = await axios.post(
      `${URL}payment/verifyOrder`,
      responseData,
      {
        withCredentials: true,
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