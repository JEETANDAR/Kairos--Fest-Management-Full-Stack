import { useRef } from "react";
import { curve, heroBackground, pa } from "../../../assets";
import LazyImage from "./LazyImage";
import Button from "../../../components/Button";
import Section from "./Section";
import { BackgroundCircles, BottomLine, Gradient } from "../../../components/design/Hero";
import { ScrollParallax } from "react-just-parallax";
import Notification from "../../../components/Notification";
import CompanyLogos from "./CompanyLogos";

const Hero = () => {
  const parallaxRef = useRef(null);

  return (
    <Section
      className=""
      crosses
      crossesOffset="lg:translate-y-[4rem]"
      customPaddings
      id="hero"
    >
      <div className="container relative" ref={parallaxRef}>
        {/* Background for both Desktop & Mobile */}
        <div className="absolute top-0 left-0 w-full h-full">
          <LazyImage
            src={heroBackground}
            className="w-full h-full object-cover lg:object-top"
            width={1440}
            height={1800}
            alt="Background"
          />
        </div>

        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-10"> {/* Reduced margin-bottom */}
          {/* KAIROS 2026 Heading */}
          <h1 className="h1 mb-6 leading-[5.25] text-[2rem] sm:text-[2.5rem] md:text-[3rem]">  {/* Reduced margin-bottom */}
            <span className="inline-block relative">
              KAIROS 2026
              <LazyImage
              src={curve}
              className="absolute top-24 md:top-36 lg:top-40 xl:top-40 left-1/2 transform -translate-x-1/2 w-[90%] md:w-full"
              width={624}
              height={28}
              alt="Curve"
            />
            </span>
          </h1>

       <div className="mama mt-[-5rem]"> {/* Adjusted to move everything slightly up */}
  {/* Subtext - Now Positioned Right Below the Heading */}
  <p className="body-1 max-w-3xl mx-auto mb-1 text-n-2 lg:mb-3">
    Inter-Collegiate Techno-Cultural-Gaming Fest
  </p>
  <p className="body-3 max-w-3xl mx-auto mb-1 text-n-2 lg:mb-3 text-[10px] sm:text-xs md:text-sm">
    Organized by Department of Computer Science
  </p>

  {/* Buttons */}
  <div className="flex justify-center gap-4">
    <Button href="#account-form" white>
      Register
    </Button>
    <Button href="https://drive.google.com/file/d/122PF-DtRBr9cq4gvlhEQoHOCbhWGnjmk/view?usp=sharing" white>
      Brochure
    </Button>
  </div>
</div>



        </div>

        {/* Main Image & Background Effects */}
        <div className="relative max-w-sm mx-auto md:max-w-5xl xl:mb-24">
          <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
            {/* Content with rounded corners */}
            <div className="relative rounded-[1rem] overflow-hidden">
              {/* PA Image for Mobile - Full Coverage */}
              <div className="md:hidden w-full h-full">
                <LazyImage
                  src={pa}
                  className="w-full h-full object-cover rounded-b-[1rem]"
                  width={500}
                  height={500}
                  alt="PA Image"
                />
              </div>

              {/* Main Image for Tablet & Desktop - Full Coverage */}
              <div className="hidden md:block w-full rounded-b-[1rem] overflow-hidden md:aspect-[1300/490] lg:aspect-[1216/490]">
                <LazyImage
                  src={pa}
                  className="w-full h-full object-cover"
                  width={1216}
                  height={490}
                  alt="PA Image"
                />
              </div>
            </div>
            <Gradient />
          </div>

          {/* Background Circles & Logos */}
          <BackgroundCircles parallaxRef={parallaxRef} />
        </div>
        <CompanyLogos className="hidden relative z-10 mt-20 lg:block" />
      </div>
      <BottomLine />
    </Section>
  );
};

export default Hero;
