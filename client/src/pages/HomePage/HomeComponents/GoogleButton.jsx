import { useState } from "react";
import URL from '../../../server/serverURL_link';

const GoogleSignInButton = () => {
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = () => {
        setLoading(true); // ✅ Set loading to true when clicking
        console.log("Redirecting to:", `${URL}auth/google`);
        window.location.href = `${URL}auth/google`;
    };

    return (
        <button
            className="flex items-center justify-center bg-white border border-gray-300 rounded-lg shadow-md px-4 py-2 hover:bg-gray-100 transition duration-200"
            onClick={handleGoogleSignIn}
            disabled={loading} // ✅ Disable button when loading
        >
            <svg id="Capa_1" style={{ enableBackground: 'new 0 0 150 150' }} version="1.1" viewBox="0 0 150 150" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <path d="M120,76.1c0-3.1-0.3-6.3-0.8-9.3H75.9v17.7h24.8c-1,5.7-4.3,10.7-9.2,13.9l14.8,11.5C115,101.8,120,90,120,76.1L120,76.1z" fill="#4285F4"/>
                    <path d="M75.9,120.9c12.4,0,22.8-4.1,30.4-11.1L91.5,98.4c-4.1,2.8-9.4,4.4-15.6,4.4c-12,0-22.1-8.1-25.8-18.9L34.9,95.6C42.7,111.1,58.5,120.9,75.9,120.9z" fill="#34A853"/>
                    <path d="M50.1,83.8c-1.9-5.7-1.9-11.9,0-17.6L34.9,54.4c-6.5,13-6.5,28.3,0,41.2L50.1,83.8z" fill="#FBBC04"/>
                    <path d="M75.9,47.3c6.5-0.1,12.9,2.4,17.6,6.9L106.6,41C98.3,33.2,87.3,29,75.9,29.1c-17.4,0-33.2,9.8-41,25.3l15.2,11.8C53.8,55.3,63.9,47.3,75.9,47.3z" fill="#EA4335"/>
                </g>
            </svg>
            <span className="text-gray-800 font-semibold">
                {loading ? 'Loading...' : 'Continue with Google'}
            </span>
        </button>
    );
};

export default GoogleSignInButton;
