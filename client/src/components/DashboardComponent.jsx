import { useEffect, useState, useRef } from "react";
// import URL from "../../serverlink/serverURL_link.js";
import EventRegistration from "./EventRegistration";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [collegeName, setCollegeName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [showEventRegistration, setShowEventRegistration] = useState(false);
    const eventRegistrationRef = useRef(null);
    const [activeSection, setActiveSection] = useState("Enter Details"); // Default active section

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${URL}/auth/user`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) throw new Error("Failed to fetch user data");
                
                const data = await response.json();

                if (data.success) {
                    setUser(data.user);
                    setPhoneNumber(data.user.phoneNumber || "");
                    setCollegeName(data.user.collegeName || "");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    const handleSave = async () => {
        try {
            const response = await fetch(`${URL}/userRout/updateUserInfo`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNo: phoneNumber, collegeName })
            });

            if (!response.ok) throw new Error("Failed to update profile");
            
            const data = await response.json();
            
            if (data.success) {
                setUser((prevUser) => ({ ...prevUser, phoneNumber, collegeName }));
                setIsEditing(false);
                alert("Profile updated successfully");
            } else {
                alert("Failed to update profile: " + data.error);
            }
        } catch (error) {
            console.error("Error updating user data:", error);
            alert("Something went wrong.");
        }
    };

    const handleNextClick = () => {
        setShowEventRegistration(true);
        setTimeout(() => {
            eventRegistrationRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#5B2E91] p-6">
            <div className="bg-blue-500 text-white w-full max-w-4xl p-10 rounded-t-lg text-center">
                <h2 className="text-lg font-semibold">Hello,</h2>
                
                <h1 className="text-black text-xl font-bold">Book your next Flight</h1>
                <div className="flex justify-center gap-2 mt-5 text-center">
                    <button
                        className={`px-1 py-2 rounded-lg w-1/3 text-sm ${
                            activeSection === "Enter Details" ? "bg-yellow-500 text-black" : "bg-white text-black"
                        }`}
                        onClick={() => setActiveSection("Enter Details")}
                    >
                        Enter Details
                    </button>
                    <button
                        className={`px-1 py-2 rounded-lg w-1/3 text-sm ${
                            activeSection === "Events" ? "bg-yellow-500 text-black" : "bg-white text-black"
                        }`}
                        onClick={() => setActiveSection("Events")}
                    >
                        Events
                    </button>
                    <button
                        className={`px-1 py-2 rounded-lg w-1/3 text-sm ${
                            activeSection === "Feature" ? "bg-yellow-500 text-black" : "bg-white text-black"
                        }`}
                        onClick={() => setActiveSection("Feature")}
                    >
                        Feature
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-lg p-10 w-full max-w-4xl rounded-b-lg">
                <label className="block text-gray-700 font-medium mb-2">Phone Number:</label>
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="border p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your phone number"
                    disabled={!isEditing}
                />
                
                <label className="block text-gray-700 font-medium mt-4 mb-2">College Name:</label>
                <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="border p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your college name"
                    disabled={!isEditing}
                />
                
                {isEditing ? (
                    <button
                        onClick={handleSave}
                        className="bg-green-500 text-white w-full py-3 mt-6 rounded-lg hover:bg-green-600 transition duration-300"
                    >
                        Save
                    </button>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-500 text-white w-full py-3 mt-6 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Edit & Save
                    </button>
                )}
                <button
                    onClick={handleNextClick}
                    className="bg-purple-500 text-white w-full py-3 mt-6 rounded-lg hover:bg-purple-600 transition duration-300"
                >
                    Next
                </button>
            </div>

            {showEventRegistration && (
                <div ref={eventRegistrationRef} className="mt-10 w-full max-w-4xl">
                    <EventRegistration />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
