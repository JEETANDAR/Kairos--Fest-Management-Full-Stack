// src/components/main dashboard/sharedState.ts
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
  participants: {
    id: number;
    name: string;
    college: string;
    roundScores: { [key: string]: number | undefined; total: number }; // Allow undefined for round scores
  }[];
}

// In-memory store to simulate a backend
let pendingEvents: EventData[] = [];
let approvedEvents: EventData[] = [];

export const submitEventScores = (eventData: EventData) => {
  pendingEvents.push(eventData);
};

export const getPendingEvents = () => {
  return pendingEvents;
};

export const getApprovedEvents = () => {
  return approvedEvents;
};

export const approveEvent = (eventId: string, feedback: string) => {
  const eventIndex = pendingEvents.findIndex(event => event.id === eventId);
  if (eventIndex !== -1) {
    const event = pendingEvents[eventIndex];
    pendingEvents.splice(eventIndex, 1);
    approvedEvents.push({
      ...event,
      status: 'approved',
      approvedAt: new Date().toISOString(),
      feedback,
    });
  }
};

export const rejectEvent = (eventId: string, feedback: string) => {
  const eventIndex = pendingEvents.findIndex(event => event.id === eventId);
  if (eventIndex !== -1) {
    const event = pendingEvents[eventIndex];
    pendingEvents[eventIndex] = {
      ...event,
      status: 'rejected',
      rejectedAt: new Date().toISOString(),
      feedback,
    };
  }
};