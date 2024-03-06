const HttpServer = require('./HttpServer');
const UserRepository = require('./repository/UserRepository');
const ActivityService = require('./service/ActivityService')
const UserService = require('./service/UserService')
const ActivityRouter = require('./api/ActivityRouter')
const UserRouter = require('./api/UserRouter')

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userRouter = new UserRouter(userService);

const activityService = new ActivityService(userService);
const activityRouter = new ActivityRouter(activityService);

const httpServer = new HttpServer(activityRouter, userRouter);
httpServer.startServer();