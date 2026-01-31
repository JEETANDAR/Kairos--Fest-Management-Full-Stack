import { useState } from "react";
import Button from "../../../components/Button";
import Heading from "./Heading";
import Section from "./Section";
import Tagline from "../../../components/Tagline";
import { check2, grid, loading1 } from "../../../assets";
import { Gradient } from "../../../components/design/Roadmap";

const DescriptionRenderer = ({ descripton }) => {
  const [expanded, setExpanded] = useState(false);

  if (Array.isArray(descripton) && descripton.length > 0) {
    const allLines = descripton.flatMap(point => point.split(",").map(line => line.replace(/["“”]/g, "").trim()));
    const visibleLines = expanded ? allLines : allLines.slice(0, 3);
    
    return (
      <div className="text-n-4 text-sm leading-relaxed">
        {visibleLines.map((line, index) => (
          <p key={index} className="block">{line}</p>
        ))}
        {allLines.length > 3 && (
          <button
            className="text-white mt-2"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Read Less" : "Read More"}
          </button>
        )}
      </div>
    );
  }
  return <p className="text-n-4 text-sm">No description available</p>;
};

const EventsLayout = ({ roadmap, title, idVal }) => (
  <Section className="overflow-hidden" id={idVal}>
    <div className="text-center container md:pb-1">
      <Heading title={title} />
      
      <div className="relative grid gap-6 md:grid-cols-2 md:gap-4 md:pb-1">
        {Array.isArray(roadmap) && roadmap.length > 0 && roadmap.map((item) => {
          return (
            <div
              className={`md:flex even:md:translate-y-0 p-0.25 rounded-2xl ${
                item.colorful ? "bg-conic-gradient" : "bg-n-6"
              }`}
              key={item.eventID}
            >
              <div className="relative p-8 bg-n-8 rounded-2xl overflow-hidden xl:p-10">
                <div className="absolute top-0 left-0 max-w-full rounded-2xl overflow-hidden">
                  <img
                    className="w-full"
                    style={{ aspectRatio: "1", borderRadius: "inherit" }}
                    src={grid}
                    width={550}
                    height={550}
                    alt="Grid"
                  />
                </div>
                
                <div className="relative z-1">
                  <div className="flex items-center justify-between max-w-27rem">
                    <div className="flex items-center px-4 py-1 bg-n-1 rounded text-n-8">
                      <img
                        className="mr-2.5"
                        src={item.status === "done" ? check2 : loading1}
                        width={16}
                        height={16}
                        alt={item.status}
                      />
                      <div className="tagline">{item.status}</div>
                    </div>
                  </div>
                  
                  <div className="mb-10 -my-10 -mx-15">
                    <img
                      className="w-full rounded-2xl"
                      style={{ aspectRatio: "1.8" }}
                      src={item.img}
                      width={628}
                      height={426}
                      alt={item.eventID}
                    />
                  </div>
                  
                  <h4 className="h4 mb-4">{item.eventName}</h4>
                  
                  <div className="mb-4">
                    <h5 className="text-lg font-semibold text-n-2 mb-2">Description:</h5>
                    <DescriptionRenderer descripton={item.descripton} />
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 p-4 bg-n-7 rounded-lg">
                    <div>
                      <p className="text-n-3 text-xs md:text-sm">Registration Fee</p>
                      <p className="text-n-1 font-medium text-sm md:text-base">₹{item.registrationFee}</p>
                    </div>
                    
                    <div>
                      <p className="text-n-3 text-sm">Participants</p>
                      <p className="text-n-1 font-medium">{item.minimumNoOfParticipants} - {item.maximumNoOfParticipants}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4 p-4 bg-n-7 rounded-lg">
                    <div>
                      <p className="text-n-3 text-sm">Winners</p>
                      <p className="text-n-1 font-medium">₹{item.winners}</p>
                    </div>
                    
                    <div>
                      <p className="text-n-3 text-sm">Runners</p>
                      <p className="text-n-1 font-medium">₹{item.runners}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button href="#account-form">
                      Register Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        <Gradient />
      </div>
    </div>
  </Section>
);

export default EventsLayout;