import React from "react";
import Section from "./Section";
import { socials } from "../../../constants";

const Footer = () => {
  // If your socials array has a different structure, modify this to match
  // Example structure for socials if needed
  const socialLinks = socials || [
    {
      id: "facebook",
      title: "Facebook",
      url: "https://www.facebook.com/stpaulsbengaluru/",
      iconUrl: "/icons/facebook.svg"
    },
    {
      id: "twitter",
      title: "Twitter",
      url: "https://twitter.com",
      iconUrl: "/icons/twitter.svg"
    },
    {
      id: "instagram",
      title: "Instagram",
      url: "https://instagram.com",
      iconUrl: "/icons/instagram.svg"
    }
  ];

  return (
    <Section crosses className="!px-0 !py-10 bg-black text-white">
      <div className="container flex sm:justify-between justify-center items-center gap-10 max-sm:flex-col text-center sm:text-left">
        
        {/* Copyright and Department */}
        <p className="caption text-gray-400 lg:block">
          © {new Date().getFullYear()} All rights reserved | Department of Computer Science
        </p>
        
        {/* Developer Section (Laptop: One Line | Mobile: Names on Next Line in One Line) */}
        <div className="text-gray-300 flex flex-col sm:flex-row sm:items-center text-center sm:text-left">
          <p className="font-semibold sm:mr-2">Developed by </p>
          <div className="flex justify-center sm:justify-start gap-2 flex-wrap">
            {/* <u><a href="https://ardendiago-resume.netlify.app/">Arden</a></u> */}
            <u><a href="https://jeetandar-portfolio01.netlify.app">Jeetandar</a></u>
            {/* <u><a href="https://ajin-2004.github.io/Portfolio-Website/">Ajin</a></u> */}
          </div>
        </div>
        
        {/* Social Icons */}
        <ul className="flex gap-5 flex-wrap">
          {socialLinks.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-full transition-colors hover:bg-gray-700"
            >
              <img src={item.iconUrl} width={16} height={16} alt={item.title} />
            </a>
          ))}
        </ul>
      </div>
    </Section>
  );
};

export default Footer;