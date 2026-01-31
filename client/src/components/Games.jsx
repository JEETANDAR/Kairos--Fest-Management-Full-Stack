import { useEffect, useState } from "react";
import Button from "./Button";
import Heading from "../pages/HomePage/HomeComponents/Heading";
import Section from "../pages/HomePage/HomeComponents/Section";
import Tagline from "./Tagline";
import { check2, grid, loading1 } from "../assets";
import { Gradient } from "./design/Roadmap";
import URL from '../server/serverURL_link'


const Events = () => {
  const [events, setEvents] = useState([]); // State to store fetched events
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    fetch(`${URL}events`) // API Call
      .then((response) => response.json())
      .then((data) => {
        setEvents(data); // Store API data in state
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Section className="overflow-hidden" id="events">
      <div className="text-center container md:pb-10">
        <Heading title="Gaming Events" />

        {loading ? ( // Show loading message while fetching
          <p>Loading events...</p>
        ) : (
          <div className="relative grid gap-6 md:grid-cols-2 md:gap-4 md:pb-[7rem]">
            {events.map((item) => {
              const status = "Done"; // Assuming all are done (Modify if needed)

              return (
                <div
                  className={`md:flex even:md:translate-y-[0rem] p-0.25 rounded-[2.5rem] bg-n-6`}
                  key={item.eventID}
                >
                  <div className="relative p-8 bg-n-8 rounded-[2.4375rem] overflow-hidden xl:p-15">
                    <div className="absolute top-0 left-0 max-w-full">
                      <img
                        className="w-full"
                        src={grid}                                                  
                        width={550}
                        height={550}
                        alt="Grid"
                      />
                    </div>
                    <div className="relative z-1">
                      <div className="flex items-center justify-between max-w-[27rem] mb-8 md:mb-20">
                        <Tagline>{new Date(item.time).toDateString()}</Tagline>

                        <div className="flex items-center px-4 py-1 bg-n-1 rounded text-n-8">
                          <img
                            className="mr-2.5"
                            src={check2}
                            width={16}
                            height={16}
                            alt={status}
                          />
                          <div className="tagline">{status}</div>
                        </div>
                      </div>

                      <div className="mb-10 -my-10 -mx-15">
                        <img
                          className="w-full h-auto"
                          src={item.img}
                          width={628}
                          height={426}
                          alt={item.eventName}
                          onError={(e) => (e.target.src = "https://via.placeholder.com/150")} // Fallback image
                        />
                      </div>
                      <h4 className="h4 mb-4">{item.eventName}</h4>
                      <p className="body-2 text-n-4">
                        Venue: {item.venue} | Fee: ₹{item.registrationFee}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <Gradient />
          </div>
        )}
      </div>
    </Section>
  );
};

export default Events;
