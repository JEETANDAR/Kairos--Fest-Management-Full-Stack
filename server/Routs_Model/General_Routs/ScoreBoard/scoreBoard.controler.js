const { getScores, getIndividualScore, adminScorePannel, postScoreStudenCoordinator, postScoreByFacultyCoordinator } = require('../../../Data_Model/score');

// Shows the scores to the user
async function getScoreDetails(req, res) {
    try {
        // Converts the objects and removes all the unwanted data from the information
        const scores = await getScores();
        return res.status(200).json(scores);
    } catch (error) {
        console.error("Error fetching scores:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// shows the score for the coordinator event wise take a id as input :/id
async function getEventScoreStudent(req, res) {
    const url = req.url.split('/')[2];
    try {
        const result = await getIndividualScore(Object(url));
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching scores:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// For me
async function wholeAccess(req, res) {
    try {
        const scores = await adminScorePannel();
        return res.status(200).json(scores);
    } catch (error) {
        console.error('Error fetching scores: ', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


// Allows the student coordinator to post results to the server and waits for teacher approval.
async function postEventScoreStudent(req, res) {
    const url = req.url.split('/')[2] ; // Getting the event name from the URL
    const reqData = req.body;

    // Validate request data
    if (
        !reqData.firstPlace ||
        !reqData.secondPlace ||
        !Array.isArray(reqData.firstPlacePoints) ||
        !Array.isArray(reqData.secondPlacePoints)
    ) {
        return res.status(400).json({ message: "Invalid Data Format" });
    }

    try {
        const data = await postScoreStudenCoordinator(reqData, url); // Call the data layer function
        console.log("Data in response from the server: ", data);
        if (data.modifiedCount > 0) {
            return res.status(200).json({ message: "Scores updated successfully.", data });
        } else {
            return res.status(404).json({ message: "No matching event found to update. or No change required." });
        }
    } catch (error) {
        console.error("Error updating scores: ", error);
        return res.status(500).json({ message: String(error) });
    }
}

// Shows the result to the teacher
async function getEventScoreTeacher(req, res) {
    const url = req.url.split('/')[2];
    try {
        const scores = await getIndividualScore(Object(url));
        return res.status(200).json(scores);
    } catch (error) {
        console.error('Error fetching scores: ', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}

// lets the teacher to accept or deny the data.
async function postEventScoreTeacher(req, res) {
    const url = req.url.split('/')[2];
    const { decision } = req.body;
    if (typeof (decision) !== 'boolean') {
        return res.status(200).json({ message: "Invalid decison type." });
    }
    try {
        const verifyScores = await postScoreByFacultyCoordinator(url, decision);
        return res.status(200).json(verifyScores);
    } catch (err) {
        console.error('Error Fetching Scores', err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    getScoreDetails,
    getEventScoreStudent,
    postEventScoreStudent,
    getEventScoreTeacher,
    postEventScoreTeacher,
    wholeAccess,
}