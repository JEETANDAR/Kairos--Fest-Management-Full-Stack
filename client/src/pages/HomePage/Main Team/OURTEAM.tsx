import { Instagram, Linkedin, Twitter, Globe } from "lucide-react";
import React, { useState } from "react";
import { cn } from "./lib/utils";
import { teamDictionary } from "./tm.js";

interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  website?: string;
}

interface TeamMember {
  id: string;
  image: string;
  name: string;
  title: string;
  social: SocialLinks;
  categories: string[];
}

const TeamMemberCard: React.FC<TeamMember & { className?: string }> = ({
  image,
  name,
  title,
  social,
  className,
}) => {
  return (
    <div
      className={cn(
        "group flex flex-col sm:flex-row items-center gap-6 p-6 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 backdrop-blur-sm",
        className
      )}
    >
      <div className="relative w-32 h-32 min-w-[8rem] min-h-[8rem] overflow-hidden rounded-xl flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
      <div className="flex flex-col items-center sm:items-start gap-2 flex-grow">
        <h3 className="text-2xl font-bold text-white text-center sm:text-left">{name}</h3>
        <p className="text-gray-300 text-lg text-center sm:text-left break-words">{title}</p>
        <div className="flex gap-4 mt-2">
          <a
            href={social.twitter || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Twitter size={20} />
          </a>
          <a
            href={social.linkedin || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Linkedin size={20} />
          </a>
          <a
            href={social.instagram || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Instagram size={20} />
          </a>
          <a
            href={social.website || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Globe size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

type Tab = "directors" | "team";

const OURTEAM: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("directors");

  const allStudents: TeamMember[] = teamDictionary["Students"] || [];

  // Festival Directors: Jeetandar & Saniya
  const festivalDirectors = allStudents.filter((m) =>
    ["Jeetandar N Silwani", "Saniya Stafford"].includes(m.name)
  );

  // Team: ALL students (including Jeetandar & Saniya)
  const teamMembers = allStudents;

  return (
    <div id="our-team" className="min-h-screen bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Page Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">Our Team</h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">The faces behind KAIROS 2026</p>
        </div>

        <div className="text-center mb-16">
  <h2 className="text-3xl font-bold text-white mb-3">Management</h2>

  {/* Decorative SVG divider */}
  <div className="flex justify-center mb-8 ">
    <svg width="220" height="18" viewBox="0 0 220 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="9" x2="80" y2="9" stroke="url(#fadeLeft)" strokeWidth="1.5"/>
      <circle cx="92" cy="9" r="2" fill="#6b7280"/>
      <circle cx="110" cy="9" r="4" fill="none" stroke="#9ca3af" strokeWidth="1.5"/>
      <circle cx="110" cy="9" r="1.5" fill="#9ca3af"/>
      <circle cx="128" cy="9" r="2" fill="#6b7280"/>
      <line x1="140" y1="9" x2="220" y2="9" stroke="url(#fadeRight)" strokeWidth="1.5"/>
      <defs>
        <linearGradient id="fadeLeft" x1="0" y1="0" x2="80" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6b7280" stopOpacity="0"/>
          <stop offset="100%" stopColor="#6b7280" stopOpacity="1"/>
        </linearGradient>
        <linearGradient id="fadeRight" x1="140" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6b7280" stopOpacity="1"/>
          <stop offset="100%" stopColor="#6b7280" stopOpacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  </div>

  <div className="flex justify-center">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    
    {(teamDictionary["Students"] || [])
      .filter((item: TeamMember) => item.name === "Dr. Fr. Thomas M.J")
      .map((item: TeamMember) => (
        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center">
          <TeamMemberCard key={item.id} {...item} />
        </div>
      ))}

  </div>
</div>
</div>

        {/* Faculty Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-3">Faculty</h2>
          {/* Decorative SVG divider */}
          <div className="flex justify-center mb-8">
            <svg width="220" height="18" viewBox="0 0 220 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="9" x2="80" y2="9" stroke="url(#fadeLeft)" strokeWidth="1.5"/>
              <circle cx="92" cy="9" r="2" fill="#6b7280"/>
              <circle cx="110" cy="9" r="4" fill="none" stroke="#9ca3af" strokeWidth="1.5"/>
              <circle cx="110" cy="9" r="1.5" fill="#9ca3af"/>
              <circle cx="128" cy="9" r="2" fill="#6b7280"/>
              <line x1="140" y1="9" x2="220" y2="9" stroke="url(#fadeRight)" strokeWidth="1.5"/>
              <defs>
                <linearGradient id="fadeLeft" x1="0" y1="0" x2="80" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#6b7280" stopOpacity="0"/>
                  <stop offset="100%" stopColor="#6b7280" stopOpacity="1"/>
                </linearGradient>
                <linearGradient id="fadeRight" x1="140" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#6b7280" stopOpacity="1"/>
                  <stop offset="100%" stopColor="#6b7280" stopOpacity="0"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(teamDictionary["Faculty"] || []).map((item: TeamMember) => (
                <TeamMemberCard key={item.id} {...item} />
              ))}
            </div>
          </div>
        </div>

        {/* Students Section */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-3 text-center">Students</h2>
          {/* Decorative SVG divider */}
          <div className="flex justify-center mb-8">
            <svg width="220" height="18" viewBox="0 0 220 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="9" x2="80" y2="9" stroke="url(#fadeLeft2)" strokeWidth="1.5"/>
              <circle cx="92" cy="9" r="2" fill="#6b7280"/>
              <circle cx="110" cy="9" r="4" fill="none" stroke="#9ca3af" strokeWidth="1.5"/>
              <circle cx="110" cy="9" r="1.5" fill="#9ca3af"/>
              <circle cx="128" cy="9" r="2" fill="#6b7280"/>
              <line x1="140" y1="9" x2="220" y2="9" stroke="url(#fadeRight2)" strokeWidth="1.5"/>
              <defs>
                <linearGradient id="fadeLeft2" x1="0" y1="0" x2="80" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#6b7280" stopOpacity="0"/>
                  <stop offset="100%" stopColor="#6b7280" stopOpacity="1"/>
                </linearGradient>
                <linearGradient id="fadeRight2" x1="140" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#6b7280" stopOpacity="1"/>
                  <stop offset="100%" stopColor="#6b7280" stopOpacity="0"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Tab Button Row */}
          <div className="flex justify-center mb-10">
            <div className="flex gap-2 bg-gray-800/60 p-1.5 rounded-xl border border-gray-700/50">
              <button
                onClick={() => setActiveTab("directors")}
                className={cn(
                  "px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
                  activeTab === "directors"
                    ? "bg-white text-gray-900 shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                )}
              >
                Festival Directors
              </button>
              <button
                onClick={() => setActiveTab("team")}
                className={cn(
                  "px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
                  activeTab === "team"
                    ? "bg-white text-gray-900 shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                )}
              >
                Team
              </button>
            </div>
          </div>

          {/* Festival Directors Tab */}
          {activeTab === "directors" && (
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {festivalDirectors.map((item) => (
                  <TeamMemberCard key={item.id} {...item} />
                ))}
              </div>
            </div>
          )}

          {/* Team Tab — ALL students */}
          {activeTab === "team" && (
  <div className="flex justify-center">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teamMembers
        .filter((item) => item.name !== "Dr. Fr. Thomas M.J")
        .map((item) => (
          <TeamMemberCard key={item.id} {...item} />
        ))}
    </div>
  </div>
)}
        </div>

      </div>
    </div>
  );
};

export default OURTEAM;