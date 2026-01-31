import { Instagram, Linkedin, Twitter, Globe } from "lucide-react";
import React from "react";
import { cn } from "./lib/utils";
import { teamDictionary } from "./tm.js"; // Importing from "./tm"

// Define interfaces for type safety
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
      <div className="relative w-32 h-32 min-w-32 min-h-32 overflow-hidden rounded-xl flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
          draggable="false"
          onContextMenu={(e) => e.preventDefault()} // Prevents right-click saving
        />
      </div>
      <div className="flex flex-col items-center sm:items-start gap-2 flex-grow">
        <h3 className="text-2xl font-bold text-white text-center sm:text-left">{name}</h3>
        <p className="text-gray-300 text-lg text-center sm:text-left break-words">{title}</p>
        <div className="flex gap-4 mt-2">
          {social.twitter && (
            <a
              href={social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Twitter size={20} />
            </a>
          )}
          {social.linkedin && (
            <a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin size={20} />
            </a>
          )}
          {social.instagram && (
            <a
              href={social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Instagram size={20} />
            </a>
          )}
          {social.website && (
            <a
              href={social.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Globe size={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const OURTEAM: React.FC = () => {
  return (
    <div id="our-team" className="min-h-screen bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">Our Team</h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">The faces behind KAIROS 2026</p>
        </div>

        {/* Faculty Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Faculty</h2>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamDictionary["Faculty"] &&
                teamDictionary["Faculty"].map((item) => <TeamMemberCard key={item.id} {...item} />)}
            </div>
          </div>
        </div>

        {/* Students Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Students</h2>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamDictionary["Students"] &&
                teamDictionary["Students"].map((item) => <TeamMemberCard key={item.id} {...item} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OURTEAM;
