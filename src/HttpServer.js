const express = require("express");
const http = require("http");
const config = require("./config/config");
const logger = require("./util/logger");
const mongoose = require("mongoose");
const httpRequestLogger = require("morgan");
const bodyParser = require("body-parser");

class HttpServer{
    constructor(activityRouter, userRouter) {
        this.activityRouter = activityRouter;
        this.userRouter = userRouter;
    }
    async startServer() {
        this.app = express();
        this.server = http.createServer(this.app);

        await this._load(this.app, this.server);

        this.server
            .listen(config.port, () =>
                logger.info(`
      ################################################
      activity-suggester [http] up and listening on port ${config.port}
      ################################################
      `)
            )
            .on("error", (err) => {
                logger.error(err);
                process.exit(1);
            });
    }

    async close() {
        await mongoose.connection.close();
        await this.server.close()
    }

    async _load(expressApp, server) {
        // connect to db
        try {
            await mongoose.connect(config.db.url, config.db.options);
            logger.info("Successfully connected to MongoDB!!");
        } catch (e) {
            logger.error("Could not connect to DB. App will exit now.");
            logger.error(e);
            server.close(() => process.exit());
        }

        // load the express
        expressApp.use(bodyParser.json());
        expressApp.use(bodyParser.urlencoded({ extended: true }));
        expressApp.use(httpRequestLogger(config.morgan));
        expressApp.use('/activity', this.activityRouter.getRouter());
        expressApp.use('/user', this.userRouter.getRouter());
    }

}

module.exports = HttpServer;