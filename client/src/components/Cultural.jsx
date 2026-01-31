import Button from "./Button";
import Heading from "../pages/HomePage/HomeComponents/Heading";
import Section from "../pages/HomePage/HomeComponents/Section";
import Tagline from "./Tagline";
import { roadmap } from "../constants"; // Importing the roadmap data
import { check2, grid, loading1 } from "../assets";
import { Gradient } from "./design/Roadmap";

const Cultural = () => {
  // Get the Data From the server
  

  // Limiting to only three events with updated content
  const limitedRoadmap = [
    {
      id: "0",
      title: "Group Singing",
      text: "hello lorem50 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit cum sunt sit et doloremque nisi, eveniet officia a quam, sint, dolores perspiciatis quia magnam totam itaque similique excepturi vel ducimus rerum quo! Quod, impedit adipisci voluptate soluta esse in dolor temporibus quasi eligendi expedita vero, officiis magni, animi ad iste.",
      date: "May 2023",
      status: "done",
      
      imageUrl: "https://www.rollingstone.com/wp-content/uploads/2024/05/forming-band-netflix.jpg?w=1581&h=1054&crop=1",
      colorful: true,
    },
    {
      id: "1",
      title: "Group Dance",
      text: "mama",
      date: "May 2023",
      status: "in progress",
      imageUrl: "https://img.freepik.com/free-vector/party-crowd-background_1048-10124.jpg?t=st=1738225964~exp=1738229564~hmac=68c41e1e8067e9b69688d8eddd43a88fd99cf4edb87c11443259dde58ffd1f70&w=826",
      colorful: true,
    },
    {
      id: "2",
      title: "Fashion Show",
      text: "papa",
      date: "May 2023",
      status: "upcoming",
      imageUrl: "https://kairos-24.netlify.app/assets/fw-cs4uOYRX.jpg",
      colorful: true,
    },
  ];

  return (
    <Section className="overflow-hidden" id="events">
      <div className="text-center container md:pb-10">
        <Heading title="Cultural Events" />

        <div className="relative grid gap-6 md:grid-cols-2 md:gap-4 md:pb-[7rem]">
          {limitedRoadmap.map((item) => {
            const status = item.status === "done" ? "Done" : "In progress";

            return (
              <div
                className={`md:flex even:md:translate-y-[0rem] p-0.25 rounded-[2.5rem] ${
                  item.colorful ? "bg-conic-gradient" : "bg-n-6"
                }`}
                key={item.id}
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
                      {/* <Tagline>{item.date}</Tagline> */}

                      <div className="flex items-center px-4 py-1 bg-n-1 rounded text-n-8">
                        <img
                          className="mr-2.5"
                          src={item.status === "done" ? check2 : loading1}
                          width={16}
                          height={16}
                          alt={status}
                        />
                        <div className="tagline">{status}</div>
                      </div>
                    </div>

                    <div className="mb-10 -my-10 -mx-15">
                    <img
                      className="w-full h-auto" // Updated to fit the image to full width
                      src={item.imageUrl}
                      width={628}
                      height={426}
                      alt={item.title}
                    />

                    </div>
                    <h4 className="h4 mb-4">{item.title}</h4>
                    <p className="body-2 text-n-4">{item.text}</p>
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
};

export default Cultural;
