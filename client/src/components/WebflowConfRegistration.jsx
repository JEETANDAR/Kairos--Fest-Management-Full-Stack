import React, { useState } from 'react';

const WebflowConfRegistration = () => {
    const [selectedTickets, setSelectedTickets] = useState(new Set());
    const [email, setEmail] = useState('');

    const toggleTicket = (ticketId) => {
        const newSelectedTickets = new Set(selectedTickets);
        if (newSelectedTickets.has(ticketId)) {
            newSelectedTickets.delete(ticketId);
        } else {
            newSelectedTickets.add(ticketId);
        }
        setSelectedTickets(newSelectedTickets);
    };

    const goToNextStep = () => {
        if (!email || selectedTickets.size === 0) {
            alert("Please enter your email and select at least one ticket.");
            return;
        }
        alert(`Proceeding with selected tickets: ${Array.from(selectedTickets).join(', ')}`);
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white font-sans">
            <header className="text-center mb-10">
                <h1 className="text-xl font-bold">Register for Webflow Conf 2024</h1>
                <p className="text-gray-400">Enter your business email and select your preferred tickets.</p>
            </header>

            <div className="flex justify-center items-center mb-6">
                <div className="text-center text-blue-500">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">1</div>
                    <p className="mt-2">Ticket</p>
                </div>
                <div className="w-16 h-1 bg-gray-700 mx-4"></div>
                <div className="text-center text-gray-400">
                    <div className="w-8 h-8 bg-gray-700 text-white rounded-full flex items-center justify-center">2</div>
                    <p className="mt-2">Confirmation</p>
                </div>
            </div>

            <form className="space-y-6 w-full max-w-lg">
                <div>
                    <label htmlFor="email" className="block text-sm mb-2">Business Email Address <span className="text-red-500">*</span></label>
                    <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="bg-gray-800 text-sm text-gray-300 rounded p-4">
                    We’ve filled the Athens event — you can still join us in San Francisco, London, or online!
                </div>

                <div>
                    <label className="block text-sm mb-2">Tickets <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div onClick={() => toggleTicket('sf')} className={`ticket-option bg-gray-800 text-gray-300 flex items-center justify-center p-4 rounded cursor-pointer ${selectedTickets.has('sf') ? 'bg-blue-500 text-white' : ''}`}>
                            San Francisco - $399
                        </div>
                        <div onClick={() => toggleTicket('london')} className={`ticket-option bg-gray-800 text-gray-300 flex items-center justify-center p-4 rounded cursor-pointer ${selectedTickets.has('london') ? 'bg-blue-500 text-white' : ''}`}>
                            London - $499
                        </div>
                        <div onClick={() => toggleTicket('online')} className={`ticket-option bg-gray-800 text-gray-300 flex items-center justify-center p-4 rounded cursor-pointer ${selectedTickets.has('online') ? 'bg-blue-500 text-white' : ''}`}>
                            Online - Free
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <button type="button" onClick={goToNextStep} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded">Continue</button>
                </div>
            </form>
        </div>
    );
};

export default WebflowConfRegistration;
