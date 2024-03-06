const logger = require("../util/logger");
const config = require("../config/config")
const _ = require("lodash");
const {fetchWrapper} = require('../util/util')

class ActivityService {
    constructor(userService) {
        this.userService = userService;
    }

    async getRandomActivity() {
        try {
            const activity = await fetchWrapper(config.boredAPI)
            logger.debug(`The returned activity: ${JSON.stringify(activity)}`)

            const accessibility = activity.accessibility;
            if (!_.isNumber(accessibility)) {
                logger.debug(activity);
                throw new Error(`The 'accessibility' property is not numeric:${accessibility}`);
            }

            // maps the 'accessibility' of the response
            if (accessibility <= 0.25) {
                activity.accessibility = 'High';
            } else if (accessibility <= 0.75) {
                activity.accessibility = 'Medium';
            } else {
                activity.accessibility = 'Low';
            }

            // maps the “price’ of the response
            const price = activity.price;

            if (!_.isNumber(price)) {
                logger.debug(activity);
                throw new Error(`The 'price' property is not numeric:${price}`);
            }

            if (price === 0) {
                activity.price = 'Free';
            } else if (price <= 0.5) {
                activity.price = 'Low';
            } else {
                activity.price = 'High';
            }

            return activity;
        } catch (error) {
            throw error;
        }
    }

    async getUserActivity() {
        try {
            // get the current user
            const currentUser = await this.userService.getCurrentUser();

            // if there's no any user stored
            if (!currentUser) {
                return this.getRandomActivity();
            }

            const query = this._constructQuery(config.boredAPI, currentUser.accessibility, currentUser.price)

            // fetch
            let activity = await fetchWrapper(query);
            logger.debug(`The returned activity: ${JSON.stringify(activity, null, 2)}`)

            activity.accessibility = currentUser.accessibility;
            activity.price = currentUser.price;

            return activity;
        } catch (error) {
            throw error;
        }

    }

    _constructQuery(boredAPI, accessibility, price) {
        let query = boredAPI;
        switch (accessibility) {
            case 'High':
                query += `?maxaccessibility=0.25`
                break;
            case 'Medium':
                query += `?minaccessibility=0.26&maxaccessibility=0.75`;
                break
            case 'Low':
                query += `?minaccessibility=0.76`;
                break
            default:
                throw new Error(`Invalid accessibility value: ${accessibility}`)
        }

        switch (price) {
            case 'Free':
                query += `&price=0`
                break;
            case 'Low':
                query += `&maxprice=0.5`;
                break
            case 'High':
                query += `&minprice=0.6`;
                break
            default:
                throw new Error(`Invalid price value: ${accessibility}`)
        }
        return query;
    }
}

module.exports = ActivityService;