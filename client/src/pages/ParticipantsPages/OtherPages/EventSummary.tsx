import React, { useState, useEffect } from "react";
import { Upload, X, Music } from "lucide-react";
import { Event, Profile } from "../../../components/TS_Exp/types";
import { getUsersEventInfo, uploadEventSong, saveUserEvents } from "../../../server/userInfo.js";

interface EventSummaryProps {
  userProfile: Profile;
}

interface Event {
  orderNo: number;
  emails: string[];
  participantsNotEntered: Record<string, any>;
  participants: { name: string; email: string; phone?: string; college?: string }[];
  paymentMethod?: "online" | "cash";
}

const EventSummary: React.FC<EventSummaryProps> = ({ userProfile }) => {
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        console.log("Fetching events...");

        // Step 1: Try fetching from the server
        const response = await getUsersEventInfo();
        const serverData = response.data;
        console.log("Server data:", serverData);

        if (Array.isArray(serverData) && serverData.length > 0) {
          setUserEvents(serverData);
          console.log("Set userEvents:", serverData);
          localStorage.setItem("registeredEvents", JSON.stringify(serverData));
          return;
        }

        // Step 2: Fallback to local storage
        const storedEvents = localStorage.getItem("registeredEvents");
        if (storedEvents) {
          const parsedEvents = JSON.parse(storedEvents);
          console.log("Local storage data:", parsedEvents);
          setUserEvents(parsedEvents);
          try {
            await saveUserEvents(parsedEvents);
          } catch (syncError) {
            console.warn("Failed to sync events to backend", syncError);
          }
          return;
        }

        // Step 3: Fallback to userProfile
        const profileEvents = userProfile.registeredEvents?.filter(e => e.id) || [];
        console.log("Profile events:", profileEvents);
        setUserEvents(profileEvents);
        localStorage.setItem("registeredEvents", JSON.stringify(profileEvents));
        try {
          await saveUserEvents(profileEvents);
        } catch (syncError) {
          console.warn("Failed to sync events to backend", syncError);
        }
      } catch (err) {
        console.error("Error loading events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [userProfile]);

  // Log userEvents after the state updates
  useEffect(() => {
    console.log("Current userEvents state:", userEvents);
  }, [userEvents]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-gray-400 text-lg">Loading your events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
        Your Registered Events
      </h2>

      {userEvents.length === 0 ? (
        <div className="bg-gray-900 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            No Events Registered Yet
          </h3>
          <p className="text-gray-500">
            Register for events to see them here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {userEvents.map((event, eventIndex) => {
            console.log(`Event ${eventIndex}:`, event);
            const hasParticipantsNotEntered = event.participantsNotEntered && Object.keys(event.participantsNotEntered).length > 0;

            return (
              <div key={event.orderNo || eventIndex} className="bg-gray-800 rounded-lg p-6 shadow-lg">
                {hasParticipantsNotEntered ? (
                  Object.entries(event.participantsNotEntered).map(([eventName, teams]) => (
                    <div key={eventName} className="mb-6 last:mb-0">
                      <h3 className="text-xl font-semibold text-white mb-4">{eventName}</h3>
                      {Object.entries(teams).map(([teamName, teamMembers]) => (
                        <div key={teamName} className="mb-4 last:mb-0">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <h4 className="text-lg font-medium text-purple-300 mb-2 md:mb-0">
                              {teamName}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              <span className="bg-purple-600 px-3 py-1 rounded-full text-sm">
                                {teamMembers.length} Participants
                              </span>
                              {event.paymentMethod && (
                                <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
                                  {event.paymentMethod === "online" ? "Online" : "Cash"}
                                </span>
                              )}
                              <span className="bg-gray-600 px-3 py-1 rounded-full text-sm">
                                Team Code: {`KA_${event.orderNo}_${teamName.split(/[\s-]+/)[1]}`} 
                              </span>
                            </div>
                          </div>

                          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {teamMembers.map((email: string, index: number) => {
                              console.log("user data: ", event.participants)
                              const participant = event.participants?.find((p) => p.emailID === email);
                              return (
                                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                                  {participant ? (
                                    <div className="space-y-2">
                                      <p className="font-medium text-white truncate">
                                        {participant.name}
                                      </p>
                                      <div className="text-gray-300 text-sm space-y-1">
                                        <p className="truncate">{participant.emailID}</p>
                                        <p>{participant.phoneNo || "No phone provided"}</p>
                                        <p>{participant.collegeName || "No college info"}</p>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-gray-400 text-sm">
                                      No matching participant for email: {email}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">
                    No participant data available for this event (Order No: {event.orderNo || "N/A"}).
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventSummary;