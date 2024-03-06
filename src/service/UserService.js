const logger = require("../util/logger");
const config = require("../config/config")
const _ = require("lodash");

class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async createNewUser(name, accessibility, price) {
        try {
            return await this.userRepository.createUser(name, accessibility, price);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.userRepository.getLastSavedUser();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserService;