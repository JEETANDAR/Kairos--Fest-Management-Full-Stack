import { benefits } from "../../../constants";
import Heading from "./Heading";
import Section from "./Section";
import LazyImage from "./LazyImage";
import { GradientLight } from "../../../components/design/Benefits";
import ClipPath from "../../../assets/svg/ClipPath";

const cardBackgrounds = [
  "/card-1.svg",
  "/card-2.svg",
  "/card-3.svg",
];

const Benefits = () => {
  return (
    <Section id="features">
      <div className="container relative z-2 w-[90%] mx-auto mt-[-2rem] lg:mt-[-13rem]">
        <Heading className="text-center md:max-w-md lg:max-w-2xl" title="Events" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {benefits.map((item, index) => (
            <a
              href={`#${item.idVal}`} // Links to the respective section (tec, cul, gam)
              key={item.id}
              className="block relative p-0.5 bg-no-repeat bg-cover bg-center md:max-w-[24rem] transition-transform hover:scale-105"
              style={{
                backgroundImage: `url(${cardBackgrounds[index]})`,
                backgroundSize: "100% 100%",
                backgroundPosition: "center center",
              }}
            >
              <div className="relative z-2 flex flex-col min-h-[22rem] p-[2.4rem] pointer-events-none">
                <h5 className="h5 mb-5">{item.title}</h5>
                <p className="body-2 mb-6 text-n-3">{item.text}</p>
                <div className="flex items-center mt-auto">
                  <LazyImage src={item.iconUrl} width={48} height={48} alt={item.title} />
                  <p className="ml-auto font-code text-xs font-bold text-n-1 uppercase tracking-wider">
                    Know More|
                  </p>
                </div>
              </div>

              {item.light && <GradientLight />}

              <div className="absolute inset-0.5 bg-n-8" style={{ clipPath: "url(#benefits)" }}>
                <div className="absolute inset-0 opacity-0 transition-opacity hover:opacity-10">
                  {item.imageUrl && (
                    <LazyImage
                      src={item.imageUrl}
                      width={380}
                      height={362}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              <ClipPath />
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Benefits;