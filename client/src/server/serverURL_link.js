let myUrl;

if (import.meta.env.MODE === "production") {
    myUrl = "https://kairos.spcpegasus.com/api/";
} else {
    myUrl = "http://localhost:9000/api/";
}

export default myUrl;
