import Cookies from "js-cookie";
import axios from "axios";
import URL from "../server/serverURL_link";

const getUserSession = async () => {
    let sessionData = null;
    try {
        const token = Cookies.get("userInfo");
        const response = await axios.get(`${URL}userRout/updateUserInfo`, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("Response is: ", response);

        if (!token && response.status === 200) {
            console.log("Expires AT: ", response.data);

            const data = {
                userCount: response.data.userID || "",
                college: response.data.collegeName,
                email: response.data.emailID,
                name: response.data.name,
                phone: response.data.phoneNo,
                events: response.data.events,
            };

            console.log("Cookie data to be stored: ", data);
            sessionData = data;

            setCookie(data, response.data.expiresAt);
        } else if (response.status !== 200) {
            return null;
        } else {
            const cookieData = Cookies.get("userInfo");
            console.log("Cookie Data Retrieved: ", cookieData);
            sessionData = cookieData ? JSON.parse(cookieData) : null;
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
    }

    return sessionData;
};

function setCookie(data, expiresAt) {
    const sessionExpireTime = new Date(expiresAt);
    const currentTime = new Date();
    const timeDifference = (sessionExpireTime - currentTime) / (1000 * 60 * 60); // Convert to hours

    Cookies.set("userInfo", JSON.stringify(data), {
        expires: timeDifference > 0 ? timeDifference / 24 : 1, // Convert hours to days, ensure at least 1 day
        path: "/",
    });
}

async function updateUserInformation(data) {
    try {
        let finalData = {};

        if (data.phone) finalData.phoneNo = data.phone;
        if (data.name) finalData.name = data.name;
        if (data.college) finalData.collegeName = data.college;

        let cookieData = Cookies.get("userInfo") ? JSON.parse(Cookies.get("userInfo")) : {};

        console.log("Current cookie data: ", cookieData);

        const response = await axios.post(`${URL}userRout/updateUserInfo`, finalData, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });

        if (response.status === 200) {
            if (data.phone) cookieData.phone = data.phone;
            if (data.name) cookieData.name = data.name;
            if (data.college) cookieData.college = data.college;

            // Ensure expiresAt is valid, or set a default expiration
            const expiresAt = cookieData.expiresAt ? new Date(cookieData.expiresAt) : new Date(Date.now() + 24 * 60 * 60 * 1000);

            setCookie(cookieData, expiresAt);
        }
        return response;
    } catch (err) {
        console.error("Error updating user information: ", err);
        return null;
    }
}

async function getUsersEventInfo() {
    try {
        const response = await axios.get(`${URL}userRout/eventsRegistration/registeredEvents`, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("The data is: ", response.data);
        return response;
    } catch (error) {
        console.error("Error fetching user events:", error);
        throw error; // Re-throw to allow the calling function to handle it
    }
}

async function uploadEventSong(eventId, file) {
    try {
        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('eventId', eventId);
        formData.append('songFile', file);

        // Send the file to the server
        const response = await axios.post(`${URL}userRout/eventsRegistration/uploadSong`, formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error uploading song:", error);
        // Return null to signal that the API call failed
        return null;
    }
}

async function saveUserEvents(events) {
    try {
        const response = await axios.post(`${URL}userRout/eventsRegistration/saveEvents`, { events }, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error saving user events:", error);
        throw error; // Re-throw to allow the calling function to handle it
    }
}

export { getUserSession, updateUserInformation, getUsersEventInfo, uploadEventSong, saveUserEvents };