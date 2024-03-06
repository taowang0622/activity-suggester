const express = require('express');
const logger = require('../util/logger')

class ActivityRouter {
    constructor(activityService) {
        this.router = express.Router();
        this.activityService = activityService;

        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/', async (req, res, next) => {
            try {
                const activity = await this.activityService.getUserActivity();
                res.json(activity);
            } catch (error) {
                logger.error(error)
                res.status(500).json({error: 'Internal Server Error'})
            }
        });
    }

    getRouter() {
        return this.router;
    }
}



module.exports = ActivityRouter;
