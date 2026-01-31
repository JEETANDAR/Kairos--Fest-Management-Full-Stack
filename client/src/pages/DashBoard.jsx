import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const userData = query.get("user");
        
        if (userData) {
            // Store user in localStorage
            localStorage.setItem("user", userData);
            setUser(JSON.parse(decodeURIComponent(userData)));
        } else {
            // Retrieve user from localStorage (persists after refresh)
            const savedUser = localStorage.getItem("user");
            if (savedUser) setUser(JSON.parse(savedUser));
        }
    }, [location]);

    return (
        <div className="p-6">
            {user ? (
                <h1 className="text-2xl font-semibold">Welcome, {user.displayName}!</h1>
            ) : (
                <h1 className="text-2xl font-semibold">Loading...</h1>
            )}
        </div>
    );
};

export default Dashboard;
