
import { useNavigate } from 'react-router-dom';
import { UserCircle, Users } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto p-6">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
          KAIROS 2026 DASHBOARD
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/login')}
            className="bg-purple-600 hover:bg-purple-700 transition-colors rounded-lg p-8 text-center group"
          >
            <UserCircle className="w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-bold mb-2">Login as Coordinator</h2>
            <p className="text-gray-300">
              Access event management and scoring system
            </p>
          </button>
          
          <button
            onClick={() => navigate('/participant')}
            className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg p-8 text-center group"
          >
            <Users className="w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-bold mb-2">Proceed to Registration</h2>
            <p className="text-gray-300">
              Register for events and manage your participation
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;