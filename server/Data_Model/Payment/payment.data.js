const mongoose = require('mongoose');

// Schemas
const OrderNo = require('../../schema/Payment/orderNO.schema');
const OrdersSchema = require('../../schema/Payment/oders.schema');
const VerifyOrders = require('../../schema/Payment/verifyOrder.schema');
const Teams = require('../../schema/registrationSchema/registration.schema');

// Generates the current order
async function generateOrderNo(emailWithKeys, paymentMethod, participantsEmails) {
    const session = await mongoose.startSession();
    session.startTransaction(); // Ensure transaction uses primary node

    try {
        // Find the document with the highest orderNo
        const lastOrder = await OrderNo.findOne({}, {}, { sort: { orderNo: -1 } });
        const eventsKeys = Object.keys(emailWithKeys);

        // Get the next order number
        console.log("Participants Emails: ", participantsEmails, " Email With Keys: ", emailWithKeys)
        const newOrderNo = lastOrder ? lastOrder.orderNo + 1 : 1;

        // Create the new order document
        const newOrder = new OrderNo({
            orderNo: newOrderNo,
            paymentMethod: paymentMethod,
            events: emailWithKeys,
            emails: participantsEmails,
            participantsNotEntered: emailWithKeys,
        });

        console.log("New Order to be added: ", newOrder);

        // Save the new order within the transaction
        await newOrder.save();

        console.log("Order is about to be committed:", newOrder);

        // Commit the transaction
        await session.commitTransaction();

        console.log("Order committed successfully:", newOrder);
        return newOrder;
    } catch (error) {
        await session.abortTransaction();
        console.error("Transaction failed:", error);
        throw new Error("Error generating order number: " + error.message);
    } finally {
        session.endSession(); // Ensure session is closed in all cases
    }
} //done

// Adds an order to the Orders table
async function addOrdersDetails(data, trys = 0) {
    try {
        const success = await OrdersSchema.create(data);
        console.log("\n\nCreated:", success);

        if (!success.id) {
            console.log('Error adding data:', data);
        }
    } catch (err) {
        console.error("Data not added:", String(err));
        if (trys < 3) {
            await addOrdersDetails(data, trys + 1);
        }
        else {
            throw new Error("Error to add order Details");
        }
    }
}

// Retrieves an order ID by searching for a specific order
async function orderSchemaID(id) {
    return await OrdersSchema.findOne({ orderId: id }).lean().select({ _id: 1, orderNo: 1});
}

// Adds payment verification details
async function addVerifiedData(data) {
    return await VerifyOrders.create(data);
}

// Retrieves orderNo linked to a specific user order
async function addOrderNoToUser(id) {
    const order = await OrdersSchema.findOne({ _id: id }).populate({
        path: "orderNo",
        model: "OrderNo"
    });

    return order ? order.orderNo : null;
}

async function getRegisteredEventsData(event) {
    const data = await order.find({ orderNo: event }).lean().select({})
}

module.exports = {
    generateOrderNo,
    addOrdersDetails,
    orderSchemaID,
    addVerifiedData,
    addOrderNoToUser,
    getRegisteredEventsData,
};


