// Sample question data
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
  
  // Function to get questions with a timer
  async function getQuestions(req, res) {
    try {
      // Record the start time
      const startTime = Date.now();
  
      // If the request includes new question data (e.g., via POST body), add it
      if (req.method === "POST" && req.body && req.body.question) {
        const newQuestion = {
          question: req.body.question,
          options: req.body.options,
          correctAnswer: req.body.correctAnswer,
        };
        questions.push(newQuestion); // Accept new data
  
        // Calculate elapsed time for adding the question
        const elapsedTime = Date.now() - startTime;
        return res.status(201).json({
          message: "New question added",
          newQuestion,
          elapsedTimeMs: elapsedTime,
        });
      }
  
      // Simulate a quiz timer (e.g., max 30 seconds for the client to respond)
      const quizDurationSeconds = 30; // Configurable timer duration
      const quizEndTime = startTime + quizDurationSeconds * 1000;
  
      // Send the existing questions with timer info (e.g., for a GET request)
      const elapsedTime = Date.now() - startTime;
      return res.status(200).json({
        questions,
        quizDurationSeconds,
        timeRemainingMs: quizEndTime - Date.now(), // How much time is left
        elapsedTimeMs: elapsedTime, // Time taken to process the request
      });
    } catch (err) {
      console.error("Error in getting or adding questions: ", err);
      return res.status(500).json({ error: "Internal server error", details: String(err) });
    }
  }
  
  module.exports = {
    getQuestions,
  };

//   Example Responses:
// GET Request:
// {
//     "questions": [
//       {
//         "question": "Which of the following is NOT a key responsibility of an IT Manager?",
//         "options": ["Strategic planning...", "Writing code...", "Managing IT staff...", "Ensuring IT systems..."],
//         "correctAnswer": "Writing code for all company applications"
//       }
//     ],
//     "quizDurationSeconds": 30,
//     "timeRemainingMs": 29950,
//     "elapsedTimeMs": 50
//   }


// POST Request (adding a new question):
// {
//     "message": "New question added",
//     "newQuestion": {
//       "question": "What is the capital of France?",
//       "options": ["Paris", "London", "Berlin", "Madrid"],
//       "correctAnswer": "Paris"
//     },
//     "elapsedTimeMs": 10
//   }