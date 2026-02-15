let myUrl;

if (import.meta.env.MODE === "production") {
    myUrl = "http://65.1.95.29/api/";
} else {
    myUrl = "http://localhost:9000/api/";
}

export default myUrl;
