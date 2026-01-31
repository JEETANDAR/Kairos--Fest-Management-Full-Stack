import React, { useState, useRef } from 'react';
import { UploadCloud, X, Share2 } from 'lucide-react';

const PhotoBooth: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<{ url: string; type: string }[]>([]);
  const [uploaded, setUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const uploadedFiles = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video') ? 'video' : 'image',
      }));
      setMediaFiles((prev) => [...prev, ...uploadedFiles]);
    }
  };

  const handleRemove = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    setUploaded(true);
    setTimeout(() => setUploaded(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto text-center">
      <h2 className="text-2xl font-bold">Upload Photos & Videos</h2>
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <label
          className="flex flex-col items-center justify-center space-y-3 cursor-pointer p-6 border-2 border-dashed border-gray-500 rounded-lg hover:border-purple-500 transition"
        >
          <UploadCloud className="w-10 h-10 text-gray-400" />
          <span className="text-gray-300">Click or Drag & Drop to Upload</span>
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileUpload}
            ref={fileInputRef}
            multiple
          />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {mediaFiles.map((media, index) => (
          <div key={index} className="relative">
            {media.type === 'video' ? (
              <video src={media.url} controls className="w-full rounded-lg" />
            ) : (
              <img src={media.url} alt="Uploaded" className="w-full rounded-lg object-cover" />
            )}
            <button
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
      {mediaFiles.length > 0 && (
        <button
          onClick={handleUpload}
          className="mt-4 bg-green-600 hover:bg-green-700 transition-colors px-6 py-2 rounded-lg"
        >
          Upload
        </button>
      )}
      {uploaded && <p className="text-green-400 mt-2">Thanks for sharing!</p>}
    </div>
  );
};

export default PhotoBooth;