const mongoose = require("mongoose");
const OrderNo = require("../../schema/Payment/orderNO.schema");
const Teams = require("../../schema/registrationSchema/registration.schema");
const UserData = require("../../schema/Users/UserData.schema");
const { ObjectId } = mongoose.Types;

async function getEventRegistration(eventName) {
  //   const formattedData = await Teams.aggregate([
  //     {
  //       $match: { eventName: eventName }, // Match by eventName instead of orderID
  //     },
  //     {
  //       $lookup: {
  //         from: "UserData", // Make sure this is the actual MongoDB collection name
  //         localField: "teamDetails", // Emails stored in Teams
  //         foreignField: "emailID", // Emails stored in UserData
  //         as: "teamInfo", // Output user details here
  //       },
  //     },
  //   ]);
  const orderInfo = await OrderNo.aggregate([
    {
      $match: {
        _id: { $in: eventName.map((id) => new mongoose.Types.ObjectId(id)) },
      },
    },
    {
      $project: {
        // ✅ Select only specific fields from OrderNo
        _id: 0,
        orderNo: 1,
        emails: 1,
        emails: 1,
        paymentMethod: 1
      },
    },
    {
      $lookup: {
        from: "userdatas", // ✅ Ensure correct collection name (lowercase by default)
        let: { orderEmails: "$emails" }, // Pass emails array from OrderNo
        pipeline: [
          {
            $match: {
              $expr: {
                $in: [
                  { $toLower: "$emailID" },
                  {
                    $map: {
                      input: "$$orderEmails",
                      as: "e",
                      in: { $toLower: "$$e" },
                    },
                  },
                ],
              },
            },
          },
          { $project: { _id: 0, emailID: 1, name: 1, collegeName: 1 } }, // ✅ Only return needed fields
        ],
        as: "participants",
      },
    },
  ]);

  console.log(JSON.stringify(orderInfo, null, 2));

  console.log("order Info: ", orderInfo);
  return orderInfo;
}

module.exports = {
  getEventRegistration,
};
