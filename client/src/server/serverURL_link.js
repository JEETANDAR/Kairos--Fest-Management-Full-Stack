let myUrl;

if (import.meta.env.MODE === "production") {
    myUrl = "https://kairos-backend-otd3.onrender.com/api/";
} else {
    myUrl = "http://localhost:9000/api/";
}

export default myUrl;