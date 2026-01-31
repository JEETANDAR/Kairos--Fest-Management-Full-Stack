import React, { useEffect, useState } from "react";
import {
  Camera,
  User,
  CalendarCheck,
  ChevronRight,
  Settings,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";
import EventRegistration from "./OtherPages/EventRegistration";
import EventSummary from "./OtherPages/EventSummary";
// import PhotoBooth from "./PhotoBooth";
import ProfileEditor from "./OtherPages/ProfileEditor";
// import Scoreboard from "./Scoreboard";
import { getUserSession } from "../../server/userInfo";

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  college?: string;
  avatar: string;
  isProfileComplete: boolean;
  registeredEvents: any[]; // Should be typed more strictly (e.g., Event[]), but keeping as per your code
}

interface Section {
  title: string;
  icon: React.ComponentType<any>;
  component: JSX.Element;
}

const ParticipantDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("profile");
  const [showProfileEditor, setShowProfileEditor] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const userInfo = await getUserSession();
        console.log("ParticipantDashboard - Fetched UserInfo:", userInfo);
        if (userInfo) {
          const updatedProfile: UserProfile = {
            name: userInfo.name || "",
            email: userInfo.email || "",
            phone: userInfo.phone || "",
            college: userInfo.college || "",
            avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${userInfo.name || "default"}`,
            isProfileComplete: !!(userInfo.college && userInfo.phone), // Ensure boolean
            registeredEvents: userInfo.events || [], // Explicitly set to empty array if undefined
          };
          console.log("ParticipantDashboard - Set UserProfile:", updatedProfile);
          setUserProfile(updatedProfile);
        } else {
          console.log("ParticipantDashboard - No user info fetched, setting profile to null");
          setUserProfile(null);
        }
      } catch (err) {
        console.error("ParticipantDashboard - Error fetching user profile:", err);
        setUserProfile(null); // Fallback to null on error
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const updateProfile = (newProfile: Partial<UserProfile>) => {
    if (userProfile) {
      setUserProfile((prev) => {
        const updatedProfile = prev ? { ...prev, ...newProfile } : null;
        console.log("ParticipantDashboard - Updated UserProfile:", updatedProfile);
        return updatedProfile;
      });
    }
    setShowProfileEditor(false);
  };

  const sections: Record<string, Section> = {
    profile: {
      title: "Profile & Registration",
      icon: User,
      component: !userProfile ? (
        <p className="text-center p-8">Please sign in to access your profile...</p>
      ) : (
        <EventRegistration userProfile={userProfile} onUpdateProfile={updateProfile} />
      ),
    },
    summary: {
      title: "Event Summary",
      icon: CalendarCheck,
      component: userProfile ? (
        <EventSummary userProfile={userProfile} />
      ) : (
        <p className="text-center p-8">Sign in to view your event summary...</p>
      ),
    },
    // photos: {
    //   title: "Photo Booth",
    //   icon: Camera,
    //   component: <PhotoBooth />,
    // },
    // scores: {
    //   title: "Score Board",
    //   icon: Trophy,
    //   component: <Scoreboard />,
    // },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Event Dashboard</h1>
            <Link
              to="/scoreboard"
              className="hidden md:flex items-center space-x-2 text-purple-400 hover:text-purple-300"
            >
              <Trophy className="w-5 h-5" />
              <span>Scoreboard</span>
            </Link>
          </div>
          {userProfile && (
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline font-medium">{userProfile.name}</span>
              <span className="hidden md:inline text-gray-300">{userProfile.email}</span>
              <button
                onClick={() => setShowProfileEditor(true)}
                className="relative group"
              >
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-10 h-10 rounded-full border-2 border-purple-500 transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Settings className="w-5 h-5 text-white" />
                </div>
              </button>
            </div>
          )}
        </div>
      </header>

      {showProfileEditor && userProfile && (
        <ProfileEditor
          profile={userProfile}
          onSave={updateProfile}
          onClose={() => setShowProfileEditor(false)}
        />
      )}

      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid md:grid-cols-[250px,1fr] gap-6">
          <div className="space-y-2">
            {Object.entries(sections).map(([key, section]: [string, Section]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                disabled={
                  key !== "profile" && (!userProfile || !userProfile.isProfileComplete)
                }
                className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${
                  activeSection === key
                    ? "bg-purple-600 text-white"
                    : key !== "profile" && (!userProfile || !userProfile.isProfileComplete)
                    ? "bg-gray-700 opacity-50 cursor-not-allowed"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <section.icon className="w-5 h-5" />
                  <span>{section.title}</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            ))}
          </div>

          <div className="bg-gray-800 rounded-lg p-0">
            {sections[activeSection].component}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboard;