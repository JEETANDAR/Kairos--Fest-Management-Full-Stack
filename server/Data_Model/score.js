const Score = require('../schema/Scores.schema');

// Gets the scores and factors the unwanted data.
async function getScores() {
    const result = await Score.find({ teacherCoordinator: true })
        .lean()
        .select({ eventName: 1, firstPlace: 1, secondPlace: 1, _id: 0 });

    return result;
}

// it will send individual scores
async function getIndividualScore(eventName) {
    const score = await Score.find({ eventID: eventName.toUpperCase() })
        .lean()
        .select({ __v: 0, _id: 0, studentCoordinator: 0, teacherCoordinator: 0 });
    return score;
}

// Calculates the sum of points
function calculateSum(arr) {
    return arr.reduce((sum, ele) => sum + ele, 0);
}

// Updates the scores with new data
async function postScoreStudenCoordinator(data, id) {
    const { firstPlace, firstPlacePoints, secondPlace, secondPlacePoints } = data;

    // Calculate total points
    const firstPlaceTotalPoints = calculateSum(firstPlacePoints);
    const secondPlaceTotalPoints = calculateSum(secondPlacePoints);
    try {
        const findDataObj = await Score.find({ eventID: id.toUpperCase(), teacherCoordinator: true })

        if (!findDataObj.length) {
            // Update the database
            const updatedData = await Score.updateOne(
                { eventID: id.toUpperCase() },
                {
                    $set: {
                        studentCoordinator: true,
                        firstPlace,
                        firstPlacePoints,
                        secondPlace,
                        secondPlacePoints,
                        firstPlaceTotalPoints,
                        secondPlaceTotalPoints
                    }
                }
            );
            console.log("Data in the updating Stage: ", updatedData)
            return updatedData;

        } else {
            throw new Error("the faculty coordinator has apprioved of it");
        }
    } catch (error) {
        console.error("Error updating scores:", error);
        throw new Error(error);
    }
}


async function postScoreByFacultyCoordinator(eventID, decision) {
    const data = Score.find(eventID);
    if (data.studentCoordinator) {
        throw new Error("Failed to update the scores in the database");
    } else {
        if (decision) {
            const data = Score.updateOne({ eventID: eventID.toUpperCase() }, {
                $set: {
                    teacherCoordinator: true
                }
            });
            return data;
        } else {
            const data = Score.updateOne({ eventID: eventID.toUpperCase() }, {
                $set: {
                    studentCoordinator: false
                }
            });
            return data;
        }

    }
}

// it will send all the data to the controler
async function adminScorePannel() {
    return await Score.find({});
}

module.exports = {
    getScores,
    getIndividualScore,
    adminScorePannel,
    postScoreStudenCoordinator,
    postScoreByFacultyCoordinator,
};