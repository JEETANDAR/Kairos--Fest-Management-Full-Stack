import { companyLogos } from "../../../constants";

const CompanyLogos = ({ className }) => {
  return (
    <div className={`${className} flex flex-col items-center`}> 
      <h5 className="tagline mb-0 text-center mt-15 md:mt-10 text-xl md:text-4xl font-bold">
  Meet our Sponsors
</h5>



      <ul className="flex flex-wrap justify-center mb-6 gap-4 md:flex-nowrap md:gap-0">
        {companyLogos.map((logo, index) => (
          <li
            className="flex items-center justify-center w-full md:flex-1 h-[8.5rem]"
            key={index}
          >
            <img src={logo} width={134} height={28} alt={`Company logo ${index + 1}`} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyLogos;