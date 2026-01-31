const inner_structuer = (used, description, code = null, methods) => {
    return {
        used: used,
        description: description,
        code: code,
        methods: methods,
    }
}

const routsDocument = {
    "/": inner_structuer('document for the api', 'used to show all about how the api functions its different methods', 'get'),
    "/events": inner_structuer('Display the events details', 'this route is used to show all the event, its timing, venue, coordinators, etc', 'get'),
    "/events/:eventName": inner_structuer('Display the events details with a particular sub catogary', 'this route is used to show all the event, its timing, venue, coordinators, etc', 'get'),
    "/auth/google": inner_structuer('Used for google authenciation', 'this route provides the user to sign in via google and lets us controle site permissions', 'get'),
    "/auth/logout": inner_structuer('Used to logout', 'this clears the current browser sessions and allows the user to logout the website', 'get'),
    "/auth/failure": inner_structuer("sets a alert for the user when a failure occurs", "used to tell the user that a failure has occured during the signIn or LogIn process", "get"),
    "/scoreBoard": inner_structuer("Score Board for the user", "This will declare all the results for the users", "get"),

    "/scoreBoard/studentCoordinator/:eventID": inner_structuer("Score Board & Portal for coordinators to uploade the marks for the for the coordinator", "`his will declare all the results to the coordinator if he has declared it, it will give key insights on how many rounds and the number of points earned in each event, this also provides the user to send the data to the database and to validate, store and wate for approvila from the faculty coordinator. its request package should contain the folling body. {\"firstPlace\": \"Fallen Angle\",\"firstPlacePoints\": [90,300,200,60],\"secondPlace\": \"Gods of earth\",\"secondPlacePoints\": [20,50,10,50]}", "get, post"),

    "/scoreBoard/teacherCoordinator/:eventID": inner_structuer("Score Board & Portal for Teachers to approve of the marks for their respectived evetns", "This route will allow the facaulty coordiantor to approve of the points as per the events. the coordinator will either approve or reject the marks. if approved then it will be desplayed on the '/scoreBoard' route if denied then the student coordinator will have to re check for the marks and only one the faculty coordinator approves of it then it will be displayed", "get, post"),
    "userRout/updateUserInfo": inner_structuer("Gets and updates user info", "this route ensures that the user infor is recived by the website & also allows the user to update his details", "[get, post]"),
    "userRout/registeredEvents": inner_structuer('Have to still work on it', 'Have to still work on it', 'Have to still work on it'),
    "userRout/eventRegisteration": inner_structuer('Have to still work on it', 'Have to still work on it', 'Have to still work on it'),
    "/payment/orders": inner_structuer("Creates a order", "this route is used to create a order for the razorpay to work. it will also update the details to the db structure:", `const response = await fetch("http://localhost:9000/payment/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    emailID: "diagoarden@gmail.com",
                    bgmi: [
                        { name: "James", emailID: "james@gmail.com", phoneNo: "xxxxxxxxxx" },
                        { name: "James", emailID: "bobthebuilder@gmail.com", phoneNo: "xxxxxxxxxx" },
                        { name: "James", emailID: "jamesbond@gmail.com", phoneNo: "xxxxxxxxxx" },
                        { name: "Jack Ryan", emailID: "JackRyan@gmail.com", phoneNo: "xxxxxxxxxx" }
                    ],
                    ITManager: [
                        { name: "Arden Diago", emailID: "nickoklejames@gmail.com", phoneNo: "xxxxxxxxxx" },
                        { name: "Zara dcruz", emailID: "zaradcruz@gmail.com", phoneNo: "xxxxxxxxxx" }
                    ]
                }),
            });`, "[Post]"),
    "/payment/verifyOrder": inner_structuer("This verifyes a order", "this route is used to verify a order. it will also update the details to the db", `async (response) => {
                    const responseData = {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id, // ✅ Correct key
                        razorpay_signature: response.razorpay_signature, // ✅ Correct key
                    };
    
                    try {
                        const verifyResponse = await fetch("http://localhost:9000/payment/verifyOrder", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(responseData),
                        });
    
                        const verifyResult = await verifyResponse.json();
                        console.log("Verify Result:", verifyResult);
    
                        if (verifyResponse.ok) {
                            window.location.href = "/success";
                        } else {
                            window.location.href = "/failure";
                        }
                    } catch (error) {
                        console.error("Verification error:", error);
                        alert("Error verifying payment");
                    }`, "[Post]"),
    "/userRout/registred/event": inner_structuer("This will return the objects and its values for all the events. ", "SAME", null, "get")
}

module.exports = routsDocument;