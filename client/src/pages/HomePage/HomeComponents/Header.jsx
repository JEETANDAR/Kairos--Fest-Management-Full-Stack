import { useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { dept, college } from "../../../assets";
import { navigation } from "../../../constants";
import Button from "../../../components/Button";
import MenuSvg from "../../../assets/svg/MenuSvg";
import { HamburgerMenu } from "../../../components/design/Header";
import { useState } from "react";

const Header = () => {
  const { hash } = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);

  const toggleNavigation = () => {
    if (openNavigation) {
      enablePageScroll();
    } else {
      disablePageScroll();
    }
    setOpenNavigation(!openNavigation);
  };

  const closeNavigation = () => {
    setOpenNavigation(false);
    enablePageScroll(); // Ensure scrolling is re-enabled when closing
  };

  return (
    <div className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${openNavigation ? "bg-n-6" : "bg-n-6/90 backdrop-blur-sm"}`}>
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <a className="hidden md:block w-[12rem] xl:mr-8" href="#hero">
          <img src={dept} width={150} height={30} alt="Dept" />
        </a>
        <nav className={`${openNavigation ? "flex" : "hidden"} fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}>
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navigation.map((item) => {
              // Hide Register and Brochure in Laptop View
              if ((item.title === "Register" || item.title === "Brouchere") && window.innerWidth >= 1024) {
                return null;
              }
              return (
                <a
                  key={item.id}
                  href={item.url}
                  onClick={closeNavigation}
                  className={`block font-code text-xs uppercase text-n-1 transition-colors hover:text-color-1 px-4 py-4 md:py-6 lg:text-xs lg:font-semibold ${item.url === hash ? "z-2 lg:text-n-1" : "lg:text-n-1/50"} lg:leading-5 lg:hover:text-n-1 xl:px-8`}
                >
                  {item.title}
                </a>
              );
            })}
          </div>
          <HamburgerMenu />
        </nav>
        <div className="ml-0 md:ml-auto">
          <img src={college} width="85%" height={50} alt="College" className="md:ml-auto md:w-[300px] md:h-[50px]" />
        </div>
        <Button className="ml-auto lg:hidden" px="px-3" onClick={toggleNavigation}>
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  );
};

export default Header;
