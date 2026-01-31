const request = require('supertest');
const express = require('express');
const router = require('./generalRouter');

jest.mock('../../Data_Model/events.data', () => ({
    getEventsData: jest.fn(),
    getEventsDataByID: jest.fn(),
    getScoreBoard: jest.fn(),
    getStudentCoordinator: jest.fn(),
    getTeacherCoordinator: jest.fn(),
}));

jest.mock('../../Data_Model/score', () => ({
    getScores: jest.fn(),
    getIndividualScore: jest.fn(),
    postScoreStudenCoordinator: jest.fn(),
    getIndividualScore: jest.fn(),
    postEventScoreTeacher: jest.fn(),
    getIndividualScore: jest.fn(),
}))

// require('../../utils/mongoDB');
const eventsData = require('../../Data_Model/events.data');
const scoreData = require('../../Data_Model/score');

const app = express();
app.use(express.json());
app.use(router);

describe('Events Controller API Tests', () => {
    test('GET / should return project details', async () => {
        const data = require('../../routsDetails');
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(data);
    });

    test('GET /events should return events data', async () => {
        const mockEvents = [{ eventID: 'EVT001', eventName: 'Hackathon' }];
        eventsData.getEventsData.mockResolvedValue(mockEvents);

        const response = await request(app).get('/events');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockEvents);
    });

    test('GET /events/:id should return event data by ID', async () => {
        eventsData.getEventsDataByID.mockResolvedValue({ eventID: 'EVT001' });

        const response = await request(app).get('/events/EVT001');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ eventID: 'EVT001' });
    });

    test('GET /events should handle errors', async () => {
        eventsData.getEventsData.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/events');

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Error fetching events', 'Failed to fetch events.');
    });

    test('GET /events/:id should handle errors', async () => {
        eventsData.getEventsDataByID.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/events/EVT001');

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Database error', 'Failed to fetch error with ID');
    });
});


describe('Score Board Controler API Test', () => {
    // Fixed Missing ScoreBoard Tests
    test('GET /scoreBoard should return an array', async () => {
        // scoreData.getScoreBoard.mockResolvedValue([{ team: 'Alpha', score: 100 }]);
        const res = await request(app).get('/scoreBoard');
        expect(res.status).toBe(200);
    });

    test('GET /studentCoordinator/:id should return an array', async () => {
        scoreData.getIndividualScore.mockResolvedValue({ eventID: 'coding' });
        const res = await request(app).get('/scoreBoard/studentCoordinator/coding');
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Object);
    });

    test('GET /teacherCoordinator/:category should return an array', async () => {
        scoreData.getIndividualScore.mockResolvedValue({ eventID: 'coding' });
        const res = await request(app).get('/scoreBoard/teacherCoordinator/coding');
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Object);
    });
})
