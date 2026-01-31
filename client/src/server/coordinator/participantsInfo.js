import axios from "axios";
import URL from "../serverURL_link";

// Fetch participants based on logged-in coordinator's session
async function getParticipantsInfo() {
  try {
    const response = await axios.get(`${URL}coordinator/eventParticipants`, {
      withCredentials: true, // Ensures session-based authentication
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Participants Data:", response.data);
    return response.data; // Return participant data
  } catch (err) {
    console.error("Error fetching participants:", err);
    return []; // Return an empty array instead of false
  }
}
async function submitEventScores(data) {
  try {
    const response = await axios.post(
      `${URL}coordinator`,
      data, // Send data directly as the request body
      {
        withCredentials: true, // Ensures session-based authentication
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Return the response data if needed
  } catch (err) {
    console.error("Error fetching participants:", err);
    return []; // Return an empty array instead of false
  }
}

export { getParticipantsInfo, submitEventScores };
