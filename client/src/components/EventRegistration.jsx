import React, { useState } from 'react';

const EventRegistration = () => {
  

  const [selectedEvents, setSelectedEvents] = useState([]);
  const [participants, setParticipants] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleEventToggle = (eventId) => {
    setSelectedEvents((prev) => {
      if (prev.includes(eventId)) {
        const updatedEvents = prev.filter((id) => id !== eventId);
        const updatedParticipants = { ...participants };
        delete updatedParticipants[eventId];
        setParticipants(updatedParticipants);
        return updatedEvents;
      } else {
        return [...prev, eventId];
      }
    });
  };

  const handleParticipantChange = (eventId, index, field, value) => {
    setParticipants((prev) => {
      const updated = { ...prev, [eventId]: [...(prev[eventId] || [])] };
      updated[eventId][index] = { ...updated[eventId][index], [field]: value };
      return updated;
    });
  };

  const addSelfToEvent = (eventId) => {
    setParticipants((prev) => {
      const updated = { ...prev, [eventId]: [...(prev[eventId] || []), { name: 'Me', email: '', college: '', phone: '' }] };
      return updated;
    });
  };

  const addParticipant = (eventId) => {
    setParticipants((prev) => {
      const updated = { ...prev, [eventId]: [...(prev[eventId] || []), { name: '', email: '', college: '', phone: '' }] };
      return updated;
    });
  };

  return (
    <div className="bg-black text-white min-h-screen p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{showDetails ? "PARTICIPANT DETAILS" : "SELECT EVENTS"}</h1>

      {!showDetails ? (
        <>
          {Object.keys(eventCategories).map(category => (
            <div key={category} className="mb-6">
              <button className="w-full text-left text-xl font-bold p-3 bg-gray-800 rounded" onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}>
                {category} {expandedCategory === category ? '-' : '+'}
              </button>
              {expandedCategory === category && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8 mb-4 max-w-6xl mx-auto p-4 border border-gray-700 rounded">
                  {eventCategories[category].map((event) => (
                    <div key={event.id} className={`cursor-pointer transition-all duration-300 flex flex-col items-center p-4 rounded ${selectedEvents.includes(event.id) ? 'ring-4 ring-green-500 bg-green-700' : 'bg-gray-800'}`} onClick={() => handleEventToggle(event.id)}>
                      <img src={event.image} alt={event.name} className="w-32 h-32 object-cover rounded" />
                      <h3 className="text-center mt-2 text-lg">{event.name}</h3>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {selectedEvents.length > 0 && (
            <button onClick={() => setShowDetails(true)} className="bg-blue-500 text-white px-6 py-2 rounded block mx-auto">Next</button>
          )}
        </>
      ) : (
        <>

        
          {selectedEvents.map((eventId) => (
            <div key={eventId} className="mb-6 p-4 border border-gray-700 rounded bg-gray-900">
              <h2 className="text-xl font-bold mb-4">{Object.values(eventCategories).flat().find(e => e.id === eventId)?.name}</h2>
              {participants[eventId]?.map((participant, index) => (
                <div key={index} className="mb-2">
                  <input type="text" placeholder="Co-participant Name" className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 mb-2" value={participant.name} onChange={(e) => handleParticipantChange(eventId, index, 'name', e.target.value)} />
                  <input type="email" placeholder="Email" className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 mb-2" value={participant.email} onChange={(e) => handleParticipantChange(eventId, index, 'email', e.target.value)} />
                  <input type="text" placeholder="College Name" className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 mb-2" value={participant.college} onChange={(e) => handleParticipantChange(eventId, index, 'college', e.target.value)} />
                  <input type="tel" placeholder="Phone Number" className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 mb-2" value={participant.phone} onChange={(e) => handleParticipantChange(eventId, index, 'phone', e.target.value)} />
                </div>
              ))}
              <button onClick={() => addParticipant(eventId)} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Add Participant</button>
              <button onClick={() => addSelfToEvent(eventId)} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Add Me</button>
            </div>
          ))}
          <div className="flex justify-center gap-4 mt-8">
            <button onClick={() => setShowDetails(false)} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors">
              Back
            </button>
            <button onClick={() => setShowPaymentOptions(true)} className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 transition-colors">
              Proceed to Pay
            </button>
          </div>
          {showPaymentOptions && (
            <div className="flex justify-center gap-4 mt-4">
              <button onClick={() => setShowConfirmation(true)} className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors">
                Cash
              </button>
              <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors">
                Online
              </button>
            </div>
          )}
          {showConfirmation && (
            <div className="text-center mt-4 text-lg font-bold text-green-500">
              Thank you for Registration!!
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventRegistration;
