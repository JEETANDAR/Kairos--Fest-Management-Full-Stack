import privatething from "./privatedata"; // Ensure correct import path

const PrivateAccount = () => {
  console.log("Imported Data:", privatething);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-12 px-6 lg:px-24">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <h1 className="text-4xl text-center md:text-5xl font-bold mb-10 tracking-tight text-green-400 drop-shadow-lg">
          Privacy and Policy
        </h1>

        {/* Data Rendering */}
        {privatething.length > 0 ? (
          privatething.map((item, index) => (
            <div
              key={index}
              className="mb-10 p-6 bg-gray-800/70 rounded-xl shadow-lg border border-gray-700 hover:border-green-500 transition-all duration-300"
            >
              <h2 className="text-2xl font-semibold text-green-300 mb-4">
                {item.heading}
              </h2>
              <ul className="space-y-3">
                {item.info.map((text, i) => (
                  <li
                    key={i}
                    className="text-gray-200 text-base leading-relaxed pl-4 border-l-2 border-green-500 hover:text-white transition-colors duration-200"
                  >
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-lg italic">
            No secrets to reveal yet...
          </p>
        )}
      </div>
    </div>
  );
};

export default PrivateAccount;