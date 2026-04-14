const eventShortForms = {
  IT_MANAGER: "M",
  WEB_AI: "W",
  IT_QUIZ: "Q",
  TREASURE_HUNT: "TH",
  CODING: "C",
  DUET_DANCE: "DD",
  GROUP_DANCE: "GD",
  FASHION_SHOW: "FS",
  SOLO_SINGING: "SS",
  E_FOOTBALL: "EF",
  COD: "COD",
  MINI_MILITIA: "MM",
  FREE_FIRE: "FF",
  BGMI: "BGMI",
};

// ✅ FIXED COLLEGE CODE
function getCollegeCode(collegeName = "") {
  const words = collegeName.split(" ");

  let code = "";

  words.forEach(word => {
    if (word.toLowerCase() === "college") return;

    // include numbers also
    if (!isNaN(word)) {
      code += word;
    } else {
      code += word[0];
    }
  });

  return code.toUpperCase();
}

// 🔥 CONTINGENT COUNTER
const contingentCounter = {};

function generateEventId(collegeName, events) {
  const collegeCode = getCollegeCode(collegeName);
  const base = `SPC-${collegeCode}`;

  const eventKeys = Object.keys(events);

  // ✅ CONTINGENT FIX
  if (eventKeys.length >= 14) {
    if (!contingentCounter[collegeCode]) {
      contingentCounter[collegeCode] = 1;
    } else {
      contingentCounter[collegeCode]++;
    }

    return `${base}-CONTINGENT-${contingentCounter[collegeCode]}`;
  }

  const codes = eventKeys.map(e => eventShortForms[e] || "").join("");

  return `${base}-${codes}`;
}

module.exports = generateEventId;