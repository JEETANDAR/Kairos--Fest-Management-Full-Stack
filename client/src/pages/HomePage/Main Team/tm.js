import { Divide } from "lucide-react";
import ebin from "./team photo/ebii.jpg"
import lincy from "./team photo/LINCY-1.jpg"
import Prakash from "./team photo/mrPrakashV.jpeg"
import Greeshma from "./team photo/missGreeshma.jpg"
import Manjula from "./team photo/missManjula.jpg"
import Suhas from "./team photo/mrSuhas.jpg"
import Abi from "./team photo/abi.jpg"
import Ajay from "./team photo/ajay.jpg"
import Arden from "./team photo/arden.jpg"
import Dyju from "./team photo/dyju.jpg"
import Jeetandar from "./team photo/jeetandar.jpg"
import Madiha from "./team photo/madiha.jpg"
import Nikita from "./team photo/nikita.jpg"
import Saniya from "./team photo/saniya.jpg"
import Spoorti from "./team photo/spoorti.jpg"
import Tarun from "./team photo/tarun.jpg"
import Ajin from "./team photo/ajin.jpg"
import Sud from "./team photo/sud.jpg"
import Riz from "./team photo/riz.jpg"
import Priyanka from "./team photo/pri.jpg"
import Oli from "./team photo/oli.jpg"
import Dar from "./team photo/darshn.jpg"

// Team members data
const teamData = [
  {
    id: "1",
    name: "Mr. Prakash V",
    title: "HOD, Department of Computer Science",
    image: Prakash,
    social: {
      instagram: "https://www.linkedin.com/in/prakash88",
      twitter: "#",
      linkedin: "#",
      website: "#"
    },
    categories: ["Board Members", "Faculty"]
  },
  {
    id: "2",
    name: "Ms. Greeshma V.S",
    title: "Assistant Professor",
    image: Greeshma,
    social: {
      instagram: "#",
      twitter: "#",
      linkedin: "https://www.linkedin.com/in/greeshma-vs-7b074bba/",
      website: "#",
    },
    categories: ["Board Members","Faculty"],
  },
  {
    id: "3",
    name: "Ms. Manjula S",
    title: "Assistant Professor",
    image: Manjula,
    social: {
      twitter: "#",
      linkedin: "https://www.linkedin.com/in/manjula-s-458a74353",
      instagram: "#",
      website: "#",
    },
    categories: ["Board Members","Faculty"],
  },
  {
    id: "4",
    name: "Mr. Suhas Aithal V",
    title: "Assistant Professor",
    image: Suhas,
    social: {
      twitter: "#",
      linkedin: "https://www.linkedin.com/in/suhas-aithal-v-834511b4/",
      instagram: "#",
      website: "#",
    },
    categories: ["Board Members","Faculty"],
  },
  {
    id: "5",
    name: "Ms. Lincy J",
    title: "Assistant Professor",
    image: lincy,
    social: {
      twitter: "#",
      linkedin: "https://www.linkedin.com/in/lincy-joseph-a81134174",
      instagram: "#",
      website: "#",
    },
    categories: ["Board Members","Faculty"],
  },
  {
    id: "6",
    name: "Ms. Priyanka",
    title: "Assistant Professor",
    image: Priyanka,
    social: {
      twitter: "#",
      linkedin: "#",
      instagram: "#",
      website: "#",
    },
    categories: ["Board Members","Faculty"],
  },
  {
    id: "7",
    name: "Jeetandar N Silwani",
    title: "President",
    image: Jeetandar,
    social: {
      twitter: "https://twitter.com/n_silwani",
      linkedin: "https://www.linkedin.com/in/jeetandar-n-silwani-6b6863213/",
      instagram: "https://www.instagram.com/_heisahotmess_01/",
      website: "https://jeetandar-portfolio01.netlify.app/",
    },
    categories: ["Board Members","Students"],
  },
  {
    id: "8",
    name: "Olivia Shibu",
    title: "Vice President",
    image: Oli,
    social: {
      twitter: "https://x.com/ArdenDiago",
      linkedin: "https://www.linkedin.com/in/arden-diago/",
      instagram: "https://www.instagram.com/arden.diago/",
      website: "https://ardendiago-resume.netlify.app/",
    },
    categories: ["Board Members","Students"],
  },
  {
    id: "9",
    name: "Madiha Tasleem",
    title: "Vice President",
    image: Madiha,
    social: {
      twitter: "#",
      linkedin: "#",
      instagram: "https://www.instagram.com/_.iam._.madiha._/",
      website: "#",
    },
    categories: ["Board Members","Students"],
  },
  {
    id: "10",
    name: "Saniya Stafford",
    title: "Secretary",
    image: Saniya,
    social: {
      twitter: "#",
      linkedin: "#",
      instagram: "https://www.instagram.com/yup_saniya/",
      website: "#",
    },
    categories: ["Board Members","Students"],
  },
  {
    id: "11",
    name: "Ebin R",
    title: "Technical Head",
    image: ebin,
    social: {
      twitter: "#",
      linkedin: "#",
      instagram: "https://www.instagram.com/_ebiii.__/",
      website: "#",
    },
    categories: ["Board Members","Students"],
  },
  {
    id: "12",
    name: "Dyju S",
    title: "Technical Head",
    image: Dyju,
    social: {
      twitter: "https://twitter.com/n_silwani",
      linkedin: "https://www.linkedin.com/in/jeetandar-n-silwani-6b6863213/",
      instagram: "https://www.instagram.com/_heisahotmess_01/",
      website: "https://jeetandar.carrd.co/",
    },
    categories: ["Board Members","Students"],
  },
  {
    id: "13",
    name: "Rizwana Parveen K",
    title: "Coding Head",
    image: Riz,
    social: {
      twitter: "#",
      linkedin: "#",
      instagram: "https://www.instagram.com/yup_saniya/",
      website: "#",
    },
    categories: ["Board Members","Students"],
  },
  {
    id: "14",
    name: "Ankitha A Kumar",
    title: "Coding Head",
    image: Madiha,
    social: {
      twitter: "#",
      linkedin: "#",
      instagram: "https://www.instagram.com/_.iam._.madiha._/",
      website: "#",
    },
    categories: ["Board Members","Students"],
  },
  {
    id: "15",
    name: "Sudeesh S",
    title: "Gaming Head",
    image: Sud,
    social: {
      twitter: "https://x.com/spoorthikc174?t=EnCJWkse38anHlAJ_tu3sw&s=08",
      linkedin: "https://www.linkedin.com/in/spoorthi-k-c-6a4aa9338?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      instagram: "https://www.instagram.com/spoorthi.alora?utm_source=qr&igsh=MXN1cmVhdHhjb2o0ZQ%3D%3D",
    },
    categories: ["Board Members","Students"],
  },
  {
    id: "16",
    name: "Suman B",
    title: "Gaming Head",
    image: Tarun,
    social: {
      twitter: "#",
      linkedin: "#",
      instagram: "https://www.instagram.com/the_high_shrink/",
      website: "#",
    },
    categories: ["Board Members","Students"],
  },
  {
    id: "17",
    name: "Darshn S",
    title: "Design Head",
    image: Dar,
    social: {
      twitter: "#",
      linkedin: "#",
      instagram: "https://www.instagram.com/abishin0_0/",
      website: "#",
    },
    categories: ["Board Members","Students"],
  },
  {
    id: "18",
    name: "Sanjay S",
    title: "Design Lead",
    image: Ajay,
    social: {
      twitter: "https://x.com/ajaykumarbv193",
      linkedin: " https://www.linkedin.com/in/ajay-b-v-805922334",
      instagram: "https://www.instagram.com/aj_devil__ ",
      website: "#",
    },
    categories: ["Board Members","Students"],
  },
  {
    id: "19",
    name: "Ruqaiya Ayman",
    title: "Documentation Head",
    image: Ajay,
    social: {
      twitter: "https://x.com/ajaykumarbv193",
      linkedin: " https://www.linkedin.com/in/ajay-b-v-805922334",
      instagram: "https://www.instagram.com/aj_devil__ ",
      website: "#",
    },
    categories: ["Board Members","Students"],
  },
  {
    id: "20",
    name: "Spoorthi KC",
    title: "Documentation Head",
    image: Spoorti,
    social: {
      twitter: "https://x.com/ajaykumarbv193",
      linkedin: " https://www.linkedin.com/in/ajay-b-v-805922334",
      instagram: "https://www.instagram.com/aj_devil__ ",
      website: "#",
    },
    categories: ["Board Members","Students"],
  },
  {
    id: "21",
    name: "Kavya S",
    title: "Documentation Head",
    image: Ajay,
    social: {
      twitter: "https://x.com/ajaykumarbv193",
      linkedin: " https://www.linkedin.com/in/ajay-b-v-805922334",
      instagram: "https://www.instagram.com/aj_devil__ ",
      website: "#",
    },
    categories: ["Board Members","Students"],
  },
  {
    id: "22",
    name: "Charles Branson",
    title: "Treasurer",
    image: Ajay,
    social: {
      twitter: "https://x.com/ajaykumarbv193",
      linkedin: " https://www.linkedin.com/in/ajay-b-v-805922334",
      instagram: "https://www.instagram.com/aj_devil__ ",
      website: "#",
    },
    categories: ["Board Members","Students"],
  },
  {
    id: "23",
    name: "Deekshitha R",
    title: "Joint Secretary",
    image: Ajay,
    social: {
      twitter: "https://x.com/ajaykumarbv193",
      linkedin: " https://www.linkedin.com/in/ajay-b-v-805922334",
      instagram: "https://www.instagram.com/aj_devil__ ",
      website: "#",
    },
    categories: ["Board Members","Students"],
  },
  {
    id: "24",
    name: "Sahana S",
    title: "Joint Secretary",
    image: Ajay,
    social: {
      twitter: "https://x.com/ajaykumarbv193",
      linkedin: " https://www.linkedin.com/in/ajay-b-v-805922334",
      instagram: "https://www.instagram.com/aj_devil__ ",
      website: "#",
    },
    categories: ["Board Members","Students"],
  },
];

// Create a dictionary grouped by category (supporting multiple categories per member)
const teamDictionary = teamData.reduce((acc, member) => {
  // Add member to each of their categories
  member.categories.forEach(category => {
    // Initialize category array if it doesn't exist
    if (!acc[category]) {
      acc[category] = [];
    }
    // Add member to the category array
    acc[category].push(member);
  });
  
  return acc;
}, {});

export { teamData, teamDictionary };