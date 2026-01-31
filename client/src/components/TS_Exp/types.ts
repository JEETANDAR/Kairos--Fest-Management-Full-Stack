// src/components/main dashboard/types.ts
export interface Event {
  eventID: string; // Unique identifier for the event
  eventName: string; // Name of the event
  eventType: string; // Type of event (e.g., Technical, Cultural, Gaming)
  img: string; // Image URL for the event
  registrationFee: number; // Fee for registration
  registrationDate?: string; // Optional registration date
  participants?: Participant[]; // Optional array of participants
  songFile?: string | null; // Optional song file for certain events
}

export interface Participant {
  name: string;
  email: string;
  college: string;
  phone: string;
  scores?: RoundScores;
}

export interface Profile {
  name: string;
  email: string;
  phone: string;
  college: string;
  avatar?: string;
  isProfileComplete: boolean;
  registeredEvents: Event[];
  registrationStatus?: string;
}

export interface RoundScores {
  round1: number;
  round2: number;
  round3: number;
  total: number;
}

export interface College {
  id: string;
  name: string;
  totalScore: number;
  participants: Participant[];
}
