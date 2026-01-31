import axios from "axios";
import URL from "../serverURL_link";

async function getFacultyInfo() {
    try {
        const data = await axios.get(`${URL}faculty`, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log("Faculty Data is: ", data);
        return data.data;
    } catch (err) {
        console.log("Error: ");
    }
}

async function facultyConformation(data) {
    try {
      const response = await axios.post(`${URL}faculty/approval`, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      return response.data;
    } catch (err) {
      console.error("Error in facultyConformation:", err);
      return { error: true, message: err?.response?.data?.message || "Something went wrong" };
    }
  }
  


export {
    getFacultyInfo,
    facultyConformation,
}