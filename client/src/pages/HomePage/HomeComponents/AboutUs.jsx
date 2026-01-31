import React from "react";

const AboutUs = () => {
  return (
    
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      {/* Header */}
      <header className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
      </header>

      {/* Three Column Layout */}
      <div id="aboutus" className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <InfoCard
          title="Our College"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
              <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
              <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
              <path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
              <path d="M10 16h4" />
            </svg>
          }
          description="ST PAULS COLLEGE, Bengaluru is one of the educational undertakings of the society of St Paul, an international religious congregation founded by Blessed James Alberione in 1914. It is affiliated to Bangalore University and has NAAC Accreditation with a B++ Grade."
        />

<InfoCard
  title="Pegasus"
  icon={
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  }
  description={
    <>
      Pegasus, the Computer Science Department at {" "}
      <a 
        href="https://blr.stpaulscollege.edu.in/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-400 hover:underline"
      >
         ST PAULS COLLEGE
      </a>, excels in technology education, hosting guest lectures, workshops, and an annual hackathon to bridge academic learning with industry experience.
    </>
  }
/>



        <LocationCard />
      </div>
    </div>
  );
};

const InfoCard = ({ title, icon, description }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
      <div className="flex items-center justify-center mb-6">{icon}</div>
      <h2 className="text-2xl font-bold text-blue-400 mb-4 text-center">{title}</h2>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
};

const LocationCard = () => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
      <div className="flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-blue-400 mb-4 text-center">Find Us</h2>
      <div className="w-full h-[300px] mb-4 rounded-lg overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.01688232766!2d77.50235677321092!3d13.034596813497782!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a27af073972e739%3A0x2bfbd772ea477cbb!2sST%20PAULS%20COLLEGE!5e0!3m2!1sen!2sin!4v1738566924807!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Location Map"
          className="rounded-lg"
        ></iframe>
      </div>
      <div className="text-gray-300">
        <p className="font-semibold mb-2">Visit Us:</p>
        <p>St Pauls Campus, E-1, opposite HMT layout, Nalagadderanahalli, Peenya, Bengaluru, Karnataka 560073</p>
        <p className="mt-2 font-semibold">Contact Co-Ordinator:</p>
        <p><span className="font-semibold">Ajin:</span> 6363356169</p>
        <p><span className="font-semibold">Arden:</span> 7208715575</p>
        <p><span className="font-semibold">Nikita:</span> 9004702200</p>
      </div>
    </div>
  );
};

export default AboutUs; // Ensure default export
