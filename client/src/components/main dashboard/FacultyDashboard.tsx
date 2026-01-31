// src/components/main dashboard/FacultyDashboard.tsx
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  ChartData,
} from 'chart.js';
import { Check, X, Menu, Eye, ArrowLeft } from 'lucide-react';

// Shared state to simulate backend (updated path)
import { getPendingEvents, getApprovedEvents, approveEvent, rejectEvent } from '../TS_Exp/sharedState';

// Server file
import { getFacultyInfo, facultyConformation } from '../../server/facultyCoordinator/facultyCoordinator.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

// Type definitions
interface Participant {
  id: number;
  name: string;
  college: string;
  roundScores: {
    [key: string]: number;
    total: number;
  };
}

interface EventData {
  id: string;
  name: string;
  coordinator: string;
  rounds: string[];
  status: string;
  submittedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  feedback?: string;
  participants: Participant[];
}

interface FacultyData {
  name: string;
  event: string;
}

const FacultyDashboard = () => {
  const [pendingEvents, setPendingEvents] = useState<EventData[]>([]);
  const [approvedEvents, setApprovedEvents] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'details' | 'chart'>('list');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterMode, setFilterMode] = useState<'pending' | 'approved' | 'all'>('pending');
  const [facultyInfo, setFacultyInfo] = useState<FacultyData | null>(null);
  
  // Review feedback state
  const [reviewFeedback, setReviewFeedback] = useState('');

  // Fetch events from server on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getFacultyInfo();
        console.log("Faculty info is: ", data);
  
        if (data) {
          // Set faculty info from backend userData
          setFacultyInfo({
            name: data.userData.name,
            event: data.userData.eventType,
          });
  
          // Properly map the scores into your EventData[]
          const transformedEvents: EventData[] = data.scores.map((event: any) => ({
            id: event.id || `${Math.random()}`,
            name: event.id || "Unnamed Event",
            coordinator: event.coordinator || "Unknown",
            rounds: event.rounds || [],
            status: event.status || (event.facultySubmitted ? "approved" : "pending"),
            submittedAt: event.submittedAt || event.createdAt || new Date().toISOString(),
            approvedAt: event.approvedAt || null,
            rejectedAt: event.rejectedAt || null,
            feedback: event.feedback || "",
            participants: event.participants || [],
            facultySubmitted: event.facultySubmitted || false,
            studentSubmitted: event.studentSubmitted || false,
          }));
  
          // Categorize based on approval status
          const pendingEvents = transformedEvents.filter(
            (event) => event.facultySubmitted === false
          );
          const approvedEvents = transformedEvents.filter(
            (event) => event.facultySubmitted === true
          );
  
          setPendingEvents(pendingEvents);
          setApprovedEvents(approvedEvents);
        }
      } catch (error) {
        console.error("Failed to fetch faculty info:", error);
      }
    };
  
    fetchEvents();
  }, []);
  

  // Return to event list
  const handleBackToList = () => {
    setSelectedEvent(null);
    setViewMode('list');
    setReviewFeedback('');
  };
  
  // View event details
  const handleViewEvent = (event: EventData) => {
    setSelectedEvent(event);
    setViewMode('details');
  };
  
  // View event chart
  const handleViewChart = () => {
    setViewMode('chart');
  };
  
  // Approve event scores
  const handleApproveScores = async () => {
    if (!selectedEvent) return;
    
    console.log("Data Sent to server: ",selectedEvent);

    const data = {
      id: selectedEvent.id,
      status: "approval",
    }

    const serverResponse = await facultyConformation(data);

    console.log("Server Response: ", serverResponse);
    approveEvent(selectedEvent.id, reviewFeedback || 'Approved without comments');
    setPendingEvents(getPendingEvents());
    setApprovedEvents(getApprovedEvents());
    handleBackToList();
  };
  
  // Reject event scores
  const handleRejectScores = async () => {
    if (!selectedEvent) return;

    console.log("Data Sent to server: ",selectedEvent);

    const data = {
      id: selectedEvent.id,
      status: "Rejected",
    }

    const serverResponse = await facultyConformation(data);

    console.log("Server Response: ", serverResponse);
    
    rejectEvent(selectedEvent.id, reviewFeedback || 'Rejected without specific feedback');
    setPendingEvents(getPendingEvents());
    handleBackToList();
  };
  
  // Generate chart data
  const generateChartData = (): ChartData<'bar'> | null => {
    if (!selectedEvent) return null;
    
    const participants = selectedEvent.participants;
    const labels = participants.map(p => p.name);
    
    const rounds = selectedEvent.rounds;
    
    const datasets = rounds.map((round, index) => {
      const hue = (index * 137) % 360;
      const roundKey = `round${index + 1}`; // Assumes roundScores keys are "round1", "round2", etc.
      
      return {
        label: round,
        data: participants.map(p => p.roundScores[roundKey] || 0),
        backgroundColor: `hsla(${hue}, 70%, 60%, 0.5)`,
        borderColor: `hsl(${hue}, 70%, 50%)`,
        borderWidth: 1,
      };
    });

    return {
      labels,
      datasets,
    };
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
  
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString);
      return "Invalid Date";
    }
  
    return date.toLocaleString();
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Filter events based on current filter mode
  const filteredEvents = (): EventData[] => {
    switch (filterMode) {
      case 'pending':
        return pendingEvents;
      case 'approved':
        return approvedEvents;
      case 'all':
        return [...pendingEvents, ...approvedEvents];
      default:
        return pendingEvents;
    }
  };

  const chartData = selectedEvent ? generateChartData() : null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {viewMode !== 'list' ? (
              <button 
                onClick={handleBackToList} 
                className="text-gray-300 hover:text-white"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            ) : (
              <button 
                onClick={toggleMobileMenu} 
                className="md:hidden text-gray-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
            <h1 className="text-xl sm:text-2xl font-bold">Faculty Dashboard</h1>
          </div>
          
          <div className="flex flex-col items-end text-right">
            <span className="text-sm font-medium text-white">{facultyInfo?.name}</span>
            <span className="text-xs text-gray-300">{facultyInfo?.event}</span>
          </div>
        </div>
      </header>

      {mobileMenuOpen && viewMode === 'list' && (
        <div className="md:hidden bg-gray-800 border-b border-gray-700">
          <div className="p-4 flex flex-col space-y-3">
            <button 
              onClick={() => {setFilterMode('pending'); setMobileMenuOpen(false);}} 
              className={`text-left px-4 py-2 rounded ${filterMode === 'pending' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            >
              Pending Approval ({pendingEvents.length})
            </button>
            <button 
              onClick={() => {setFilterMode('approved'); setMobileMenuOpen(false);}} 
              className={`text-left px-4 py-2 rounded ${filterMode === 'approved' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            >
              Approved ({approvedEvents.length})
            </button>
            <button 
              onClick={() => {setFilterMode('all'); setMobileMenuOpen(false);}} 
              className={`text-left px-4 py-2 rounded ${filterMode === 'all' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            >
              All Events
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto p-3 sm:p-6">
        {viewMode === 'list' && (
          <>
            <div className="hidden md:flex mb-6 bg-gray-800 rounded-lg overflow-hidden">
              <button 
                onClick={() => setFilterMode('pending')} 
                className={`px-6 py-3 flex-1 text-center transition-colors ${filterMode === 'pending' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                Pending Approval ({pendingEvents.length})
              </button>
              <button 
                onClick={() => setFilterMode('approved')} 
                className={`px-6 py-3 flex-1 text-center transition-colors ${filterMode === 'approved' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                Approved ({approvedEvents.length})
              </button>
              <button 
                onClick={() => setFilterMode('all')} 
                className={`px-6 py-3 flex-1 text-center transition-colors ${filterMode === 'all' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                All Events
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">
                {filterMode === 'pending' && 'Events Pending Approval'}
                {filterMode === 'approved' && 'Approved Events'}
                {filterMode === 'all' && 'All Events'}
              </h2>
              
              {filteredEvents().length === 0 ? (
                <div className="bg-gray-800 p-6 rounded-lg text-center">
                  <p className="text-gray-400">No events to display.</p>
                </div>
              ) : (
                filteredEvents().map(event => (
                  <div key={event.id} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="mb-4 md:mb-0">
                        <h3 className="text-lg font-bold">{event.name}</h3>
                        <div className="text-sm text-gray-400 mt-1">Coordinator: {event.coordinator}</div>
                        <div className="text-sm text-gray-400">Teams: {event.participants.length}</div>
                        <div className="text-sm text-gray-400">Rounds: {event.rounds.length}</div>
                        <div className="text-sm text-gray-400">
                          Submitted: {formatDate(event.submittedAt)}
                        </div>
                        {event.status === 'approved' && event.approvedAt && (
                          <div className="text-sm text-green-400">
                            Approved: {formatDate(event.approvedAt)}
                          </div>
                        )}
                        {event.status === 'rejected' && event.rejectedAt && (
                          <div className="text-sm text-red-400">
                            Rejected: {formatDate(event.rejectedAt)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-start md:justify-end space-x-2">
                        <span className={`px-2 py-1 text-xs rounded ${
                          event.status === 'approved' ? 'bg-green-800 text-green-200' : 
                          event.status === 'rejected' ? 'bg-red-800 text-red-200' : 
                          'bg-yellow-800 text-yellow-200'
                        }`}>
                          {event.status === 'approved' ? 'Approved' : 
                           event.status === 'rejected' ? 'Rejected' : 'Pending'}
                        </span>
                        
                        <button
                          onClick={() => handleViewEvent(event)}
                          className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Review</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {viewMode === 'details' && selectedEvent && (
          <div className="space-y-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h2 className="text-xl font-bold">{selectedEvent.name}</h2>
                  <p className="text-gray-400">Coordinator: {selectedEvent.coordinator}</p>
                  <p className="text-gray-400">Submitted: {formatDate(selectedEvent.submittedAt)}</p>
                </div>
                
                <div className="mt-4 md:mt-0 flex space-x-2">
                  <button
                    onClick={handleViewChart}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
                  >
                    View Chart
                  </button>
                  
                  {selectedEvent.status === 'pending' && (
                    <>
                      <button
                        onClick={handleApproveScores}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm flex items-center space-x-1"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      
                      <button
                        onClick={handleRejectScores}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm flex items-center space-x-1"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
              <h3 className="text-lg font-bold mb-4">Participant Scores</h3>
              
              <table className="w-full text-sm text-left">
                <thead className="text-gray-400 border-b border-gray-700">
                  <tr>
                    <th className="py-3 px-4">Team</th>
                    {/* <th className="py-3 px-4">College</th> */}
                    {selectedEvent.rounds.map((round, index) => (
                      <th key={index} className="py-3 px-4">{round}</th>
                    ))}
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Re-Calculated Total</th>
                  </tr>
                </thead>
                <tbody>
                {selectedEvent.participants.map((participant) => {
                  let sumTotal = 0;

                  return (
                    <tr key={participant.id} className="border-b border-gray-700">
                      <td className="py-3 px-4 font-medium">{participant.collegeCode}</td>
                      {/* <td className="py-3 px-4 text-gray-300">{participant.college}</td> */}
                      {selectedEvent.rounds.map((_, index) => {
                        const roundKey = `round${index + 1}`;
                        const score = participant.roundScores?.[roundKey] || 0;
                        sumTotal += score;
                        return (
                          <td key={roundKey} className="py-3 px-4">
                            {score}
                          </td>
                        );
                      })}
                      <td className="py-3 px-4 font-medium">{participant.roundScores?.total || sumTotal}</td>
                      <td className="py-3 px-4 font-medium">{sumTotal}</td>
                    </tr>
                  );
                })}

                </tbody>
              </table>
            </div>
            
            {selectedEvent.status === 'pending' && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-3">Review Feedback</h3>
                <textarea
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  placeholder="Add comments about these scores (optional)"
                  className="w-full p-3 rounded bg-gray-700 border border-gray-600 min-h-32 focus:border-purple-500"
                />
              </div>
            )}
            
            {selectedEvent.status !== 'pending' && selectedEvent.feedback && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-3">Feedback</h3>
                <div className="p-3 rounded bg-gray-700 border border-gray-600">
                  {selectedEvent.feedback}
                </div>
              </div>
            )}
          </div>
        )}
        
        {viewMode === 'chart' && selectedEvent && (
          <div className="space-y-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedEvent.name} - Score Visualization</h2>
                <button
                  onClick={() => setViewMode('details')}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm"
                >
                  Back to Details
                </button>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg h-96">
                {chartData && (
                  <Bar 
                    data={chartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top' },
                        title: {
                          display: true,
                          text: `${selectedEvent.name} Scores by Round`,
                        },
                      },
                      scales: {
                        y: { beginAtZero: true, max: 100 },
                      },
                    }} 
                  />
                )}
              </div>
            </div>
            
            {selectedEvent.status === 'pending' && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-3">Review Decision</h3>
                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                  <textarea
                    value={reviewFeedback}
                    onChange={(e) => setReviewFeedback(e.target.value)}
                    placeholder="Add comments about these scores (optional)"
                    className="flex-1 p-3 rounded bg-gray-700 border border-gray-600 md:min-h-16 focus:border-purple-500"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleApproveScores}
                      className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded flex items-center justify-center space-x-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={handleRejectScores}
                      className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center justify-center space-x-1"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default FacultyDashboard;