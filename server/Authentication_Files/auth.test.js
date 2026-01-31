const request = require('supertest');
const app = require('../server');
require('dotenv').config();

// Mock Database Functions
jest.mock('../Data_Model/user.data', () => ({
    addUser: jest.fn(),
    searchUser: jest.fn(),
}));

describe('Authentication and User Tests (Mocked DB)', () => {
    let testUser = {
        userID: 1234567890,
        name: 'Test User',
        emailID: 'testuser@example.com',
        emailVerified: true,
    };

    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });

    test('Add new user', async () => {
        require('../Data_Model/user.data').addUser.mockResolvedValue(testUser);

        const user = await require('../Data_Model/user.data').addUser(testUser);
        expect(user).toHaveProperty('emailID', testUser.emailID);
    });

    test('Search user', async () => {
        require('../Data_Model/user.data').searchUser.mockResolvedValue([testUser]);

        const user = await require('../Data_Model/user.data').searchUser(testUser.emailID);
        expect(user.length).toBeGreaterThan(0);
        expect(user[0]).toHaveProperty('emailID', testUser.emailID);
    });

    test('Google OAuth Redirect', async () => {
        const res = await request(app).get('/auth/google');
        expect(res.status).toBe(302);
    });

    test('Fetch user session (unauthenticated)', async () => {
        const res = await request(app).get('/auth/user');
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });
});
