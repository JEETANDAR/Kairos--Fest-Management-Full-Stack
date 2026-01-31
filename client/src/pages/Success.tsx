import React from 'react';
import { PartyPopper, Home, Stars, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Success() {
  const navigate = useNavigate();
  const whatsappNumber = "+919663926665"
  const whatsappMessage = "Hello, I'm sharing the payment screenshot for registration."
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full">
              <PartyPopper className="w-10 h-10 text-green-500" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">Registration Successful!</h1>
              <p className="text-gray-400">Thank you for registering. We're excited to have you on board!</p>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                <Stars className="w-4 h-4" />
                <span>Get ready for an amazing experience</span>
                <Stars className="w-4 h-4" />
              </div>
              
              <div className="text-sm text-gray-400">
                <p>Kindly share the screenshot of the payment to the coordinator below:</p>
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 transition-colors rounded-lg text-white font-medium w-full"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Contact Coordinator on WhatsApp</span>
              </a>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-lg text-white font-medium w-full"
            >
              <Home className="w-5 h-5" />
              <span>Return Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Success;