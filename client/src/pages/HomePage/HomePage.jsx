import React, { useEffect, useState } from 'react';
import Loading from '../Loading/Loading.jsx';
import ButtonGradient from "../../assets/svg/ButtonGradient.jsx";
import Benefits from "./HomeComponents/Benefits.jsx";
import Collaboration from "../../components/Collaboration.jsx";
import Footer from "./HomeComponents/Footer.jsx";
import Header from "./HomeComponents/Header.jsx";
import Hero from "./HomeComponents/Hero.jsx";
import Pricing from "../../components/Pricing.jsx";
import TechnicalEvents from "../../components/TechnicalEvents.jsx";
import Services from "../../components/Services.jsx";
import Games from "../../components/Games.jsx";
import Cultural from "../../components/Cultural.jsx";
import AccountForm from "./HomeComponents/AccountForm.jsx";
import DashboardComponent from "../../components/DashboardComponent.jsx";
import AboutUs from "./HomeComponents/AboutUs.jsx";
import GoogleButton from './HomeComponents/GoogleButton.jsx';
import EventsLayought from './HomeComponents/EventsLayought.jsx';
import OURTEAM from './Main Team/OURTEAM.js';
import Sponser from './HomeComponents/CompanyLogos.jsx';


// Server Url
import { getEventCategory } from '../../server/events.server.js';

const HomePage = () => {
  const [getEventsDetails, setEventDetails] = useState({
    technical: [],
    gaming: [],
    cultural: [],
  });

  useEffect(() => {
    async function getEvent() {
      try {
        const culturalEvents = await getEventCategory("cultural");
        const gamingEvents = await getEventCategory("gaming");
        const technicalEvents = await getEventCategory("technical");

        console.log("The cultural events are: ", culturalEvents);

        setEventDetails(() => ({
          technical: technicalEvents,
          cultural: culturalEvents,
          gaming: gamingEvents,
        }));
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        console.log("Events are: ", getEventsDetails);
      }
    }

    getEvent();
  }, []);

  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Hero />
        <Sponser />
        <Benefits />
        
        {/* Events */}
        <EventsLayought idVal="tec" title="Technical Events" roadmap={getEventsDetails.technical} />
        <EventsLayought idVal="cul" title="Cultural Events" roadmap={getEventsDetails.cultural} />
        <EventsLayought idVal="gam" title="Gaming Events" roadmap={getEventsDetails.gaming} />

        <AccountForm />
        <OURTEAM />
        <AboutUs />
        <Footer />
      </div>

      <ButtonGradient />
    </>
  );
};

export default HomePage;