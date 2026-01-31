import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';

interface Profile {
  name: string;
  email: string;
  phone: string;
  college: string;
  avatar: string;
}

interface ProfileEditorProps {
  profile: Profile;
  onSave: (updatedProfile: Profile) => void;
  onClose: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onSave, onClose }) => {
  const [formData, setFormData] = useState<Profile>(profile);
  const [avatarSeed, setAvatarSeed] = useState<string>(profile.name);

  const regenerateAvatar = () => {
    const newSeed = Math.random().toString();
    setAvatarSeed(newSeed);
    setFormData((prev) => ({
      ...prev,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${newSeed}`,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({
      ...formData,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative group">
              <img
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`}
                alt="Profile"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-purple-500"
              />
              <button
                type="button"
                onClick={regenerateAvatar}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Upload className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setAvatarSeed(e.target.value);
              }}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              readOnly
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 opacity-75 cursor-not-allowed text-sm sm:text-base"
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">College Name</label>
            <input
              type="text"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm sm:text-base"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 sm:space-x-3 mt-4 sm:mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded text-sm sm:text-base bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (profileForm.phone && profileForm.college) {
                  onUpdateProfile({
                    ...userProfile,
                    phone: profileForm.phone,
                    college: profileForm.college,
                    isProfileComplete: true
                  });
                }
              }}
              className="w-full bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors"
              >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditor;