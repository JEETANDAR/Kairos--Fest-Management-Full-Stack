const request = require('supertest');
const app = require('../../server'); // Ensure this points to your Express app
const { addUser, removeUser } = require('../../Data_Model/user.data'); // Adjust the path based on your project structure

describe('POST /orders - Generate Order Details', () => {
    const testUser = {
        name: "Test User",
        emailID: "test@example.com",
        phoneNo: "1234567890",
        collegeName: "Test College"
    };

    beforeAll(async () => {
        // Insert test user into the database before tests
        await addUser(testUser);
    });

    afterAll(async () => {
        // Clean up test user after tests
        await removeUser(testUser.emailID);
    });

    it('should return order details when user is logged in', async () => {
        const requestBody = {
            emailID: testUser.emailID,
            bgmi: [{ emailID: "player1@example.com", name: "Player 1", phoneNo: "9876543210" }],
            ITManager: [{ emailID: "manager@example.com", name: "Manager", phoneNo: "9998887776" }]
        };

        const response = await request(app)
            .post('/orders')
            .set('Content-Type', 'application/json')
            .send(requestBody);

        console.log("Response:", response.body);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('key');
        expect(response.body).toHaveProperty('order_id');
    });

    it('should return error if user is not logged in', async () => {
        const requestBody = {
            emailID: "nonexistent@example.com", // This user should not exist
            bgmi: [{ emailID: "player2@example.com", name: "Player 2", phoneNo: "1234567890" }]
        };

        const response = await request(app)
            .post('/orders')
            .set('Content-Type', 'application/json')
            .send(requestBody);

        console.log("Response:", response.body);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Error: User not logged in");
    });
});
