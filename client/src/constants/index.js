
import {
  benefitIcon1,
  benefitIcon2,
  benefitIcon3,
  benefitIcon4,
  benefitImage2,
  chromecast,
  disc02,
  discord,
  gined,
  discordBlack,
  kill,
  charle,
  facebook,
  figma,
  file02,
  framer,
  homeSmile,
  instagram,
  notification2,
  notification3,
  notification4,
  notion,
  photoshop,
  plusSquare,
  protopie,
  raindrop,
  recording01,
  recording03,
  roadmap1,
  roadmap2,
  roadmap3,
  roadmap4,
  roadmap5,
  searchMd,
  slack,
  sliders04,
  telegram,
  twitter,
  yourlogo,
  card1,
  card2,
  card3,
  zecur,
  ias,
} from "../assets";

export const navigation = [
  {
    id: "0",
    title: "Events",
    url: "#features",
  },
  {
    id: "1",
    title: "Event Details",
    url: "#tec",
  },
  {
    id: "2",
    title: "Register",
    url: "#account-form",
  },
  {
    id: "3",
    title: "Brouchere",
    url: "https://drive.google.com/file/d/1hHaEUxNbJmcmvlib2uIkJAoEeYYwpuJN/view?usp=sharing",
  },

  {
    id: "4",
    title: "Dashboard",
    url: "/dashboard",
  },
  {
    id: "5",
    title: "Our Team",
    url: "#our-team",
  },
  {
    id: "6",
    title: "About Us",
    url: "#aboutus",
  },
];


export const heroIcons = [homeSmile, file02, searchMd, plusSquare];

export const notificationImages = [notification4, notification3, notification2];

export const companyLogos = [ ias, charle ];

export const brainwaveServices = [
  "Photo generating",
  "Photo enhance",
  "Seamless Integration",
];

export const brainwaveServicesIcons = [
  recording03,
  recording01,
  disc02,
  chromecast,
  sliders04,
];

export const roadmap = [
  {
    id: "0",
    title: "Coding and Debugging",
    text: "Enable the chatbot to understand and respond to voice commands, making it easier for users to interact with the app hands-free.",
    date: "May 2023",
    status: "done",
    imageUrl: roadmap1,
    colorful: true,
  },
  {
    id: "1",
    title: "IT Quiz",
    text: "Add game-like elements, such as badges or leaderboards, to incentivize users to engage with the chatbot more frequently.",
    date: "May 2023",
    status: "progress",
    imageUrl: roadmap2,
    colorful: true,
  },
  {
    id: "2",
    title: "IT Manager",
    text: "Allow users to customize the chatbot's appearance and behavior, making it more engaging and fun to interact with.",
    date: "May 2023",
    status: "done",
    imageUrl: roadmap3,
    colorful: true,
  },
  {
    id: "3",
    title: "Treasure Hunt",
    text: "Allow the chatbot to access external data sources, such as weather APIs or news APIs, to provide more relevant recommendations.",
    date: "May 2023",
    status: "progress",
    imageUrl: roadmap4,
    colorful: true,
  },
];

export const collabText =
  "With smart automation and top-notch security, it's the perfect solution for teams looking to work smarter.";

export const collabContent = [
  {
    id: "0",
    title: "Seamless Integration",
    text: collabText,
  },
  {
    id: "1",
    title: "Smart Automation",
  },
  {
    id: "2",
    title: "Top-notch Security",
  },
];

export const collabApps = [
  {
    id: "0",
    title: "Figma",
    icon: figma,
    width: 26,
    height: 36,
  },
  {
    id: "1",
    title: "Notion",
    icon: notion,
    width: 34,
    height: 36,
  },
  {
    id: "2",
    title: "Discord",
    icon: discord,
    width: 36,
    height: 28,
  },
  {
    id: "3",
    title: "Slack",
    icon: slack,
    width: 34,
    height: 35,
  },
  {
    id: "4",
    title: "Photoshop",
    icon: photoshop,
    width: 34,
    height: 34,
  },
  {
    id: "5",
    title: "Protopie",
    icon: protopie,
    width: 34,
    height: 34,
  },
  {
    id: "6",
    title: "Framer",
    icon: framer,
    width: 26,
    height: 34,
  },
  {
    id: "7",
    title: "Raindrop",
    icon: raindrop,
    width: 38,
    height: 32,
  },
];

export const pricing = [
  {
    id: "0",
    title: "Basic",
    description: "AI chatbot, personalized recommendations",
    price: "0",
    features: [
      "An AI chatbot that can understand your queries",
      "Personalized recommendations based on your preferences",
      "Ability to explore the app and its features without any cost",
    ],
  },
  {
    id: "1",
    title: "Premium",
    description: "Advanced AI chatbot, priority support, analytics dashboard",
    price: "9.99",
    features: [
      "An advanced AI chatbot that can understand complex queries",
      "An analytics dashboard to track your conversations",
      "Priority support to solve issues quickly",
    ],
  },
  {
    id: "2",
    title: "Enterprise",
    description: "Custom AI chatbot, advanced analytics, dedicated account",
    price: null,
    features: [
      "An AI chatbot that can understand your queries",
      "Personalized recommendations based on your preferences",
      "Ability to explore the app and its features without any cost",
    ],
  },
];

export const benefits = [
  {
    id: "0",
    title: "Technical Events",
    text: "Get ready for the challenge at the Kairos Tech Challenge! Test your coding skills, solve complex problems, and innovate solutions in a fast-paced, competitive environment. It's time to push the boundaries of technology and showcase your tech prowess!",
    backgroundUrl: card1,
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
    light: true,
    idVal: "tec", // Links to #tec
  },
  {
    id: "1",
    title: "Cultural Events",
    text: "Ready to dazzle the stage? The Kairos Cultural Showcase is your chance to shine through Group Singing, Group Dance, and a Fashion Show. Show off your talent, creativity, and style as you compete for the spotlight in a celebration of art, rhythm, and fashion!",
    backgroundUrl: card2,
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
    light: true,
    idVal: "cul", // Links to #cul
  },
  {
    id: "2",
    title: "Gaming Events",
    text: "Gear up for action in the Kairos Gaming Arena! Challenge yourself and your friends in thrilling gaming competitions. Whether you're a strategist or a fast-paced gamer, it's time to level up, conquer the game, and claim victory in this epic showdown!",
    backgroundUrl: card3,
    iconUrl: benefitIcon3,
    imageUrl: benefitImage2,
    light: true,
    idVal: "gam", // Links to #gam
  },
];

export const socials = [

  {
    id: "2",
    title: "Instagram",
    iconUrl: instagram,
    url: "https://www.instagram.com/_.pegasus_official._/?hl=en",
  },
  {
    id: "4",
    title: "Facebook",
    iconUrl: facebook,
    url: "https://www.facebook.com/stpaulsbengaluru/",
  },
];
