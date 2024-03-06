const http = require('http');
const config = require('../../src/config/config')
const { promisify } = require('util');
const ActivityRouter = require("../../src/api/ActivityRouter");
const UserRepository = require("../../src/repository/UserRepository");
const UserService = require("../../src/service/UserService");
const UserRouter = require("../../src/api/UserRouter");
const HttpServer = require("../../src/HttpServer");
const request = require('supertest');

describe('UserRouter', function () {
    const mockUser = {
        "name": "John",
        "accessibility": "High",
        "price": "Free"
    };


    let httpServer;
    let userService;

    beforeEach(async () => {
        // start the server
        userService = {
            createNewUser: jest.fn()
        };
        userService.createNewUser.mockReturnValue(mockUser)
        const userRouter = new UserRouter(userService);

        const activityRouter = new ActivityRouter(null);

        httpServer = new HttpServer(activityRouter, userRouter);
        await httpServer.startServer();
    });

    afterEach(async () => {
        await httpServer.close()
    });

    describe('POST /user', function () {
        it('should invoke the user service and return the expected JSON', async function () {
            // send a request
            const response = await request(httpServer.server)
                .post('/user')
                .send(mockUser);

            expect(userService.createNewUser).toBeCalledWith(mockUser.name, mockUser.accessibility, mockUser.price)
            expect(userService.createNewUser).toHaveBeenCalledTimes(1);
            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual(mockUser);
        });

        it('should return Bad Request when the received user profile is invalid', async function () {
            // send a request
            const response = await request(httpServer.server)
                .post('/user')
                .send({...mockUser, "accessibility": 0.25});

            expect(userService.createNewUser).toHaveBeenCalledTimes(0);
            expect(response.statusCode).toBe(400);

        })

        // TODO more comprehensive tests
    });
});