import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const FailurePage = () => {
    const [searchParams] = useSearchParams();
    const message = searchParams.get("message") || "Authentication failed.";

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold text-red-500">Authentication Failed</h1>
            <p className="text-gray-700 mt-2">{message}</p>
            <a href="/" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Try Again</a>
        </div>
    );
};

export default FailurePage;
