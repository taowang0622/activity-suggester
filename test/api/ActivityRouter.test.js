const http = require('http');
const config = require('../../src/config/config')
const { promisify } = require('util');
const ActivityRouter = require("../../src/api/ActivityRouter");
const UserRepository = require("../../src/repository/UserRepository");
const UserService = require("../../src/service/UserService");
const UserRouter = require("../../src/api/UserRouter");
const HttpServer = require("../../src/HttpServer");


describe('ActivityRouter', function () {
    const mockActivity = {
        "activity": "Learn Express.js",
        "accessibility": "High",
        "type": "education",
        "participants": 1,
        "price": "Free",
        "link": "https://expressjs.com/",
        "key": "3943506"
    };


    let httpServer;
    let activityService;

    beforeEach(async () => {
        // start the server
        const userRepository = new UserRepository();
        const userService = new UserService(userRepository);
        const userRouter = new UserRouter(userService);

        activityService = {
            getUserActivity: jest.fn()
        };
        activityService.getUserActivity.mockReturnValue(mockActivity);
        const activityRouter = new ActivityRouter(activityService);

        httpServer = new HttpServer(activityRouter, userRouter);
        await httpServer.startServer();
    });

    afterEach(async () => {
        await httpServer.close()
    });

    describe('GET /activity', function () {
        it('should invoke the activity service and return the expected JSON', async function () {
            // send a request
            const response = await fetch(`http://localhost:${config.port}/activity`);
            const activity = await response.json();

            expect(activityService.getUserActivity).toHaveBeenCalledTimes(1);
            expect(activity).toEqual(mockActivity);
        });

        // TODO more comprehensive tests
    });
});