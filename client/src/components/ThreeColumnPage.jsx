import React from 'react';
import Section from './Section';

const ThreeColumnPage = () => {
  return (
    <Section className="flex flex-col md:flex-row">
      <div className="md:w-1/3 p-4">
        <h2>About the College</h2>
        <p>Information about the college goes here.</p>
      </div>
      <div className="md:w-1/3 p-4">
        <h2>About Pegau</h2>
        <p>Information about pegau goes here.</p>
      </div>
      <div className="md:w-1/3 p-4">
        <h2>Map</h2>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509123!2d144.9537353153163!3d-37.81627997975157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f0f0f0f%3A0x0!2zMzcnMzQyLjAiUyAxNDRyMDAuMCIn!5e0!3m2!1sen!2sau!4v1616161616161!5m2!1sen!2sau"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </Section>
  );
};

export default ThreeColumnPage;
