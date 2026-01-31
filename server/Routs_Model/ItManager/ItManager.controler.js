// // Sample question data
// const questions = [
//     {
//       question: "Which of the following is NOT a key responsibility of an IT Manager?",
//       options: [
//         "Strategic planning for IT infrastructure",
//         "Writing code for all company applications",
//         "Managing IT staff and resources",
//         "Ensuring IT systems align with business goals",
//       ],
//       correctAnswer: "Writing code for all company applications",
//     },
//   ];
  
  // Function to get questions and handle requests
  async function getQuestions(req, res) {
    try {
      // If the request includes new question data (e.g., via POST body), add it
      if (req.method === "POST" && req.body && req.body.question) {
        const newQuestion = {
          question: req.body.question,
          options: req.body.options,
          correctAnswer: req.body.correctAnswer,
        };
        questions.push(newQuestion); // Accept new data
        return res.status(201).json({ message: "New question added", newQuestion });
      }
  
      // Otherwise, send the existing questions (e.g., for a GET request)
      return res.status(200).json(questions);
    } catch (err) {
      console.error("Error in getting or adding questions: ", err);
      return res.status(500).json({ error: "Internal server error", details: String(err) });
    }
  }
  
  module.exports = {
    getQuestions,
  };



//   POST Request: Send a JSON body like this to add a new question:
// json

// {
//   "question": "What is the capital of France?",
//   "options": ["Paris", "London", "Berlin", "Madrid"],
//   "correctAnswer": "Paris"
// }