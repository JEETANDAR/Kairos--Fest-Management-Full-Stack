import brackets from "../assets/svg/Brackets";

const TagLine = ({ className, children }) => {
  const dateObj = new Date(children);

  const dateOnly = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(dateObj);

  return (
    <div
      className={`tagline flex items-center justify-center flex-nowrap text-[10px] sm:text-xs
        absolute top-[-4px] left-1/2 transform -translate-x-1/2 sm:top-[-6px] whitespace-nowrap`}
    >
      <span className="w-3 h-3">{brackets("left")}</span>
      <div className="mx-2 text-n-3">{dateOnly}</div>
      <span className="w-3 h-3">{brackets("right")}</span>
    </div>
  );
};

export default TagLine;
