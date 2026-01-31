import axios from "axios";
import URL from "../serverURL_link";

async function getCoordinatorDetails() {
    try {
        const data = await axios.get(`${URL}coordinator`, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log("Coordinator Data is: ", data);
        return data.data;
    } catch (err) {
        console.log("Error: ");
    }

}


export {
    getCoordinatorDetails,
}