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
} from 'chart.js';
import { Plus, Menu, X } from 'lucide-react';

// Server Files (Assuming these exist in your project)
import { getCoordinatorDetails } from "../../server/coordinator/coordinatorInfo.js";
import { getEventCategory } from '../../server/events.server.js';
import { getParticipantsInfo } from '../../server/coordinator/participantsInfo.js';

// Shared state to simulate backend
import { submitEventScores } from '../../components/TS_Exp/sharedState.js';

// Register ChartJS components
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

// Define interfaces for type safety
interface Participant {
  id: number;
  orderID: number;
  collegeCode: string;
  teamName: string;
  emails: string[];
  score: number;
}

interface Event {
  id: string;
  name: string;
  rounds: string[];
  participants: Participant[];
}

interface CoordinatorInfo {
  coordinatorName: string;
  coordinatorEmail: string;
  coordinatorEvent: string;
}

const CoordinatorDashboard = () => {
  // State declarations
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<'scores' | 'chart'>('scores');
  const [coordinatorInfo, setCoordinatorInfo] = useState<CoordinatorInfo>({
    coordinatorName: "Loading...",
    coordinatorEmail: "Loading...",
    coordinatorEvent: "",
  });

  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamEmails, setNewTeamEmails] = useState('');
  const [showAddTeamForm, setShowAddTeamForm] = useState(false);

  const [showEditTeamForm, setShowEditTeamForm] = useState(false);
  const [editTeamId, setEditTeamId] = useState<number | null>(null);
  const [editTeamName, setEditTeamName] = useState('');
  const [editTeamEmails, setEditTeamEmails] = useState('');

  const [eventScores, setEventScores] = useState<{
    [eventId: string]: {
      [participantId: number]: {
        [roundKey: string]: number | undefined;
        total: number;
      }
    }
  }>({});

  // Fetch coordinator details on mount
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const info = await getCoordinatorDetails();
        setCoordinatorInfo(info);
      } catch (err) {
        alert("Try Again: Network Issue");
        console.error("Error fetching coordinator info:", err);
      }
    };
    getUserInfo();
  }, []);

  // Fetch events and participants with new data format
  useEffect(() => {
    if (!coordinatorInfo.coordinatorEvent) return;

    const getEvents = async () => {
      try {
        const categories = ["cultural", "gaming", "technical"];
        const eventPromises = categories.map(async (category) => {
          const events = await getEventCategory(category);
          if (!events || !Array.isArray(events)) return [];

          const rawParticipants = await getParticipantsInfo(); // New format
          const participantIds = new Set<number>();
          const participants: Participant[] = [];

          // Process the new data format
          rawParticipants.forEach((eventObj: any) => {
            const eventId = Object.keys(eventObj)[0]; // e.g., '27', '28'
            const teams = eventObj[eventId]; // e.g., { 'Team 1-GROUP DANCE': [Array], ... }

            Object.entries(teams).forEach(([teamName, emails], index) => {
              let newId = participants.length + index + 1;
              while (participantIds.has(newId)) newId++;
              participantIds.add(newId);
              let teamCode = teamName.split(/[\s-]+/)[1]

              participants.push({
                id: newId,
                orderID: eventId,
                collegeCode: `KA_${eventId}_${teamCode}`,
                teamName,
                emails: Array.isArray(emails) ? emails : [String(emails)], // Ensure emails is an array
                score: 0,
              });
            });
          });

          console.log("Coordinator Info is; ",coordinatorInfo.eventRounds)
          return events
            .filter(event => coordinatorInfo.coordinatorEvent.toUpperCase() === event.eventID)
            .map(event => ({
              id: event.eventID,
              name: event.eventName,
              participants: participants.filter(p => {
                // Match participants to event ID if needed; here we assume all participants are for the coordinator's event
                return true; // Adjust this logic if event-specific filtering is required
              }),
              rounds: coordinatorInfo.eventRounds ? coordinatorInfo.eventRounds : ["Round 1"]

            }));
        });

        const allEvents = await Promise.all(eventPromises);
        const flattenedEvents = allEvents.flat();
        setEvents(flattenedEvents);
        console.log("All Events: ", allEvents);
        if (flattenedEvents.length === 1) {
          setSelectedEvent(flattenedEvents[0]);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    getEvents();
  }, [coordinatorInfo.coordinatorEvent]);

  // Initialize event scores
  useEffect(() => {
    if (!selectedEvent) return;

    setEventScores(prev => {
      if (prev[selectedEvent.id]) return prev;

      const initialEventScores: Record<string, Record<number, { [roundKey: string]: number | undefined; total: number }>> = {
        [selectedEvent.id]: {},
      };
      selectedEvent.participants.forEach(participant => {
        initialEventScores[selectedEvent.id][participant.id] = { total: 0 };
      });
      return { ...prev, ...initialEventScores };
    });
  }, [selectedEvent]);

  // Calculate total score
  const calculateTotal = (participantScores: { [roundKey: string]: number | undefined }) => {
    return Object.keys(participantScores)
      .filter(key => key !== 'total' && participantScores[key] !== undefined)
      .reduce((sum, key) => sum + (participantScores[key] || 0), 0);
  };

  // Update participant scores
  const handleScoreUpdate = (participantId: number, roundKey: string, score: string) => {
    if (!selectedEvent) return;

    setEventScores(prev => {
      const currentEventScores = prev[selectedEvent.id] || {};
      const currentParticipantScores = currentEventScores[participantId] || { total: 0 };

      let newScore: number | undefined = score === '' ? undefined : Math.min(100, Math.max(0, parseInt(score) || 0));
      const updatedParticipantScores = { ...currentParticipantScores };
      if (newScore === undefined) delete updatedParticipantScores[roundKey];
      else updatedParticipantScores[roundKey] = newScore;
      updatedParticipantScores.total = calculateTotal(updatedParticipantScores);

      return {
        ...prev,
        [selectedEvent.id]: {
          ...currentEventScores,
          [participantId]: updatedParticipantScores,
        },
      };
    });
  };

  // Save scores
  const saveScores = async () => {
    if (!selectedEvent) return;

    const eventDataToSend = {
      id: selectedEvent.id,
      coordinator: coordinatorInfo.coordinatorName,
      rounds: selectedEvent.rounds,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      participants: selectedEvent.participants.map(participant => ({
        id: participant.id,
        name: participant.teamName,
        email: participant.emails[0],
        collegeCode: participant.collegeCode,
        roundScores: eventScores[selectedEvent.id][participant.id] || { total: 0 },
      })),
    };

    console.log("Event Data is: ", eventDataToSend);

    try {
      const data = submitEventScores(eventDataToSend);

      if (data) {
        alert(`Scores submitted successfully for ${selectedEvent.name}! Awaiting faculty approval.`);
      } else {
        alert(`Error in submition ${selectedEvent.name}! Re-enter the data?.`);
      }
    } catch (error) {
      console.error("Error submitting scores:", error);
      alert("Failed to submit scores. Please try again.");
    }
  };

  // Calculate team standings
  const getEventStandings = () => {
    if (!selectedEvent) return [];

    const teamScores = new Map<string, { score: number; clgCode: string; email: string }>();
    const currentEventScores = eventScores[selectedEvent.id] || {};

    selectedEvent.participants.forEach(participant => {
      const participantScores = currentEventScores[participant.id] || { total: 0 };
      const uniqueKey = `${participant.teamName}-${participant.emails[0]}`;
      
      teamScores.set(uniqueKey, {
        score: participantScores.total,
        clgCode: participant.collegeCode,
        email: participant.emails[0] || "No email",
      });
    });

    return Array.from(teamScores.entries())
      .map(([key, { score, email, clgCode }]) => {
        const [teamName] = key.split('-');
        return { teamName, score, email, clgCode };
      })
      .sort((a, b) => b.score - a.score);
  };

  // Generate chart data
  const generateChartData = () => {
    if (!selectedEvent) return { labels: [], datasets: [] };

    const currentEventScores = eventScores[selectedEvent.id] || {};
    const labels = selectedEvent.participants.map(p => `${p.teamName} (${p.emails[0]})`);

    const datasets = selectedEvent.rounds.map((round, index) => {
      const roundKey = `round${index + 1}`;
      const hue = (index * 137) % 360;

      return {
        label: round,
        data: selectedEvent.participants.map(p => {
          const participantScores = currentEventScores[p.id] || {};
          return participantScores[roundKey] !== undefined ? participantScores[roundKey] : 0;
        }),
        backgroundColor: `hsla(${hue}, 70%, 60%, 0.5)`,
        borderColor: `hsl(${hue}, 70%, 50%)`,
        borderWidth: 1,
      };
    });

    return { labels, datasets };
  };

  // Handle event selection
  const handleEventChange = (eventId: string) => {
    const event = events.find(evt => evt.id === eventId);
    if (event) setSelectedEvent(event);
  };

  // Add a new team
  const handleAddTeam = () => {
    if (!newTeamName.trim() || !newTeamEmails.trim() || !selectedEvent) return;

    const existingIds = selectedEvent.participants.map(p => p.id);
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    const newId = maxId + 1;

    const newParticipant = {
      id: newId,
      teamName: newTeamName,
      emails: [newTeamEmails],
      score: 0,
    };

    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === selectedEvent.id
          ? { ...event, participants: [...event.participants, newParticipant] }
          : event
      )
    );

    setSelectedEvent(prev =>
      prev ? { ...prev, participants: [...prev.participants, newParticipant] } : null
    );

    setEventScores(prev => {
      const currentEventScores = prev[selectedEvent.id] || {};
      return {
        ...prev,
        [selectedEvent.id]: {
          ...currentEventScores,
          [newId]: { total: 0 },
        },
      };
    });

    setNewTeamName('');
    setNewTeamEmails('');
    setShowAddTeamForm(false);
  };

  // Prepare to edit a team
  const handleEditTeam = (teamId: number) => {
    if (!selectedEvent) return;

    const team = selectedEvent.participants.find(p => p.id === teamId);
    if (team) {
      setEditTeamId(teamId);
      setEditTeamName(team.teamName);
      setEditTeamEmails(team.emails[0]);
      setShowEditTeamForm(true);
    }
  };

  // Update an existing team
  const handleUpdateTeam = () => {
    if (!editTeamId || !editTeamName.trim() || !editTeamEmails.trim() || !selectedEvent) return;

    const updatedParticipants = selectedEvent.participants.map(participant =>
      participant.id === editTeamId
        ? { ...participant, teamName: editTeamName, emails: [editTeamEmails] }
        : participant
    );

    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === selectedEvent.id ? { ...event, participants: updatedParticipants } : event
      )
    );

    setSelectedEvent(prev =>
      prev ? { ...prev, participants: updatedParticipants } : null
    );

    setShowEditTeamForm(false);
    setEditTeamId(null);
    setEditTeamName('');
    setEditTeamEmails('');
  };

  // Delete a team
  const handleDeleteTeam = (teamId: number) => {
    if (!selectedEvent) return;

    if (window.confirm('Are you sure you want to delete this team?')) {
      const updatedParticipants = selectedEvent.participants.filter(p => p.id !== teamId);

      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === selectedEvent.id ? { event, participants: updatedParticipants } : event
        )
      );

      setSelectedEvent(prev =>
        prev ? { ...prev, participants: updatedParticipants } : null
      );

      setEventScores(prev => {
        const currentEventScores = { ...prev[selectedEvent.id] };
        delete currentEventScores[teamId];
        return { ...prev, [selectedEvent.id]: currentEventScores };
      });
    }
  };

  // Add a new round
  const handleAddRound = () => {
    if (!selectedEvent) return;

    const newRoundIndex = selectedEvent.rounds.length + 1;
    const newRoundName = `Round ${newRoundIndex}`;
    const newRoundKey = `round${newRoundIndex}`;

    const updatedEvent = {
      ...selectedEvent,
      rounds: [...selectedEvent.rounds, newRoundName],
    };

    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === selectedEvent.id ? updatedEvent : event
      )
    );

    setSelectedEvent(updatedEvent);

    setEventScores(prev => {
      const currentEventScores = prev[selectedEvent.id] || {};
      const updatedEventScores = { ...currentEventScores };

      selectedEvent.participants.forEach(participant => {
        const participantScores = updatedEventScores[participant.id] || { total: 0 };
        updatedEventScores[participant.id] = {
          ...participantScores,
          [newRoundKey]: undefined,
          total: calculateTotal(participantScores),
        };
      });

      return { ...prev, [selectedEvent.id]: updatedEventScores };
    });
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Get participant scores
  const getParticipantScores = (participantId: number) => {
    if (!selectedEvent || !eventScores[selectedEvent.id]) return { total: 0 };
    return eventScores[selectedEvent.id][participantId] || { total: 0 };
  };

  // JSX Rendering
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button onClick={toggleMobileMenu} className="bg-indigo-600 p-2 rounded-full">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed top-0 left-0 h-full w-64 bg-gray-800 transition-transform duration-300 ease-in-out z-40 overflow-y-auto max-h-screen`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">KAIROS 25</h1>
          <div className="mb-8">
            <p className="text-gray-400 text-sm">Coordinator</p>
            <p className="font-semibold">{coordinatorInfo.coordinatorName}</p>
            <p className="text-gray-400 text-sm">{coordinatorInfo.coordinatorEmail}</p>
          </div>
          <h2 className="text-lg font-bold mb-2">Events</h2>
          {events.length === 0 ? (
            <p className="text-gray-400 text-sm">No events available</p>
          ) : (
            <ul className="space-y-2">
              {events.map(event => (
                <li key={event.id}>
                  <button
                    className={`w-full text-left py-2 px-3 rounded ${selectedEvent?.id === event.id ? 'bg-indigo-600' : 'hover:bg-gray-700'}`}
                    onClick={() => handleEventChange(event.id)}
                  >
                    {event.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="md:ml-64 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold mb-4 md:mb-0">
            {selectedEvent ? selectedEvent.name : 'Select an Event'}
          </h2>
          {selectedEvent && (
            <div className="flex space-x-2">
              <button
                className={`py-2 px-4 rounded ${activeView === 'scores' ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                onClick={() => setActiveView('scores')}
              >
                Scores
              </button>
              <button
                className={`py-2 px-4 rounded ${activeView === 'chart' ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                onClick={() => setActiveView('chart')}
              >
                Chart
              </button>
            </div>
          )}
        </div>

        {selectedEvent ? (
          <>
            {activeView === 'scores' ? (
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">{selectedEvent.name} - Team Scores</h3>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      className="flex items-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                      onClick={() => setShowAddTeamForm(!showAddTeamForm)}
                    >
                      <Plus size={18} className="mr-1" />
                      Add Team
                    </button>
                    <button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
                      onClick={handleAddRound}
                    >
                      Add Round
                    </button>
                    <button
                      className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
                      onClick={saveScores}
                    >
                      Save Scores
                    </button>
                  </div>
                </div>

                {showAddTeamForm && (
                  <div className="bg-gray-700 p-4 rounded-lg mb-6">
                    <h4 className="text-lg font-semibold mb-3">Add New Team</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Team Name</label>
                        <input
                          type="text"
                          value={newTeamName}
                          onChange={(e) => setNewTeamName(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-600 rounded py-2 px-3 text-white"
                          placeholder="Enter team name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                          type="email"
                          value={newTeamEmails}
                          onChange={(e) => setNewTeamEmails(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-600 rounded py-2 px-3 text-white"
                          placeholder="Enter email"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                        onClick={handleAddTeam}
                      >
                        Add Team
                      </button>
                    </div>
                  </div>
                )}

                {showEditTeamForm && (
                  <div className="bg-gray-700 p-4 rounded-lg mb-6">
                    <h4 className="text-lg font-semibold mb-3">Edit Team</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Team Name</label>
                        <input
                          type="text"
                          value={editTeamName}
                          onChange={(e) => setEditTeamName(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-600 rounded py-2 px-3 text-white"
                          placeholder="Enter team name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                          type="email"
                          value={editTeamEmails}
                          onChange={(e) => setEditTeamEmails(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-600 rounded py-2 px-3 text-white"
                          placeholder="Enter email"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                        onClick={() => setShowEditTeamForm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                        onClick={handleUpdateTeam}
                      >
                        Update Team
                      </button>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="pb-2 pr-4">Team</th>
                        {/* <th className="pb-2 pr-4">Email</th> */}
                        {console.log("Selected Events are: ", selectedEvent)}
                        {selectedEvent.rounds.map((round, index) => (
                          <th key={round} className="pb-2 pr-4">{round}</th>
                        ))}
                        <th className="pb-2">Total</th>
                        <th className="pb-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEvent.participants.length === 0 ? (
                        <tr>
                          <td colSpan={selectedEvent.rounds.length + 4} className="py-4 text-center text-gray-400">
                            No teams added for this event yet
                          </td>
                        </tr>
                      ) : (
                        selectedEvent.participants.map(participant => {
                          const participantScores = getParticipantScores(participant.id);
                          return (
                            <tr key={participant.id} className="border-b border-gray-700">
                              <td className="py-3 pr-4">{participant.collegeCode}</td>
                              {/* <td className="py-3 pr-4">{participant.emails.join(', ')}</td> */}
                              {selectedEvent.rounds.map((round, index) => {
                                const roundKey = `round${index + 1}`;
                                const roundScore = participantScores[roundKey] !== undefined ? participantScores[roundKey] : '';
                                return (
                                  <td key={round} className="py-3 pr-4">
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={roundScore}
                                      onChange={(e) => handleScoreUpdate(participant.id, roundKey, e.target.value)}
                                      className="w-16 bg-gray-700 border border-gray-600 rounded py-1 px-2 text-white"
                                    />
                                  </td>
                                );
                              })}
                              <td className="py-3 font-semibold">{participantScores.total || 0}</td>
                              <td className="py-3">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditTeam(participant.id)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-sm"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTeam(participant.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-sm"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg mt-6">
                  <h3 className="text-lg font-bold mb-3">{selectedEvent?.name} - Team Standings</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-600">
                          <th className="pb-2">Rank</th>
                          <th className="pb-2">College Code</th>
                          <th className="pb-2">Team</th>
                          <th className="pb-2 text-right">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getEventStandings().map((team, index) => (
                          <tr key={`${team.teamName}-${team.email}-${index}`} className="border-b border-gray-600">
                          {console.log("summary: ", team)}

                            <td className="py-2">{index + 1}</td>
                            <td className="py-2">{`${team.clgCode} `}</td>
                            <td className="py-2">{`${team.teamName} (${team.email})`}</td>
                            <td className="py-2 text-right">{team.score}</td>
                          </tr>
                        ))}
                        {getEventStandings().length === 0 && (
                          <tr>
                            <td colSpan={3} className="py-4 text-center text-gray-400">
                              No scores recorded for this event yet
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-6">{selectedEvent.name} - Score Visualization</h3>
                {selectedEvent.participants.length === 0 ? (
                  <div className="flex justify-center items-center h-80 text-gray-400">
                    No data available for visualization. Add teams and scores first.
                  </div>
                ) : (
                  <div className="h-96">
                    <Bar
                      data={generateChartData()}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
                          x: { grid: { display: false } },
                        },
                        plugins: {
                          legend: { position: 'bottom', labels: { color: 'white', padding: 20 } },
                          title: {
                            display: true,
                            text: `${selectedEvent.name} Scores by Round`,
                            color: 'white',
                            font: { size: 16 },
                            padding: { bottom: 20 },
                          },
                        },
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-lg text-gray-400">Select an event from the sidebar to manage scores</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoordinatorDashboard;