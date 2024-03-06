const express = require('express');
const logger = require("../util/logger");
const router = express.Router();


class UserRouter {
  constructor(userService) {
    this.router = express.Router();
    this.userService = userService;
    this.allowedAccessibility = ['High', 'Medium', 'Low']
    this.allowedPrice = ['Free', 'Low', 'High']

    this.setupRoutes();
  }

  setupRoutes() {
    this.router.post('/', async (req, res, next) => {
      try {
        // Extract user data from the request body
        const { name, accessibility, price } = req.body;

        // validation
        if (!this.allowedAccessibility.includes(accessibility)) {
          return res.status(400).json({error: `allowed accessibility values:[${this.allowedAccessibility}]`})
        }
        if (!this.allowedPrice.includes(price)) {
          return res.status(400).json({error: `allowed price values:[${this.allowedPrice}]`})
        }

        // Create the new user
        const newUser = await this.userService.createNewUser(name, accessibility, price);
        logger.debug(`The saved user: ${JSON.stringify(newUser)}`)

        // Respond with the created user
        res.status(201).json(newUser);
      } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  }

  getRouter() {
    return this.router;
  }
}

module.exports = UserRouter;
