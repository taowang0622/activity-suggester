const UserModel = require('../model/User')
const logger = require('../util/logger')

class UserRepository {
    async createUser(name, accessibility, price) {
        try {
            const newUser = new UserModel({
                name,
                accessibility,
                price
            });
            await newUser.save();
            logger.info(`User created successfully:${newUser.name}`);
            return newUser;
        } catch (error) {
            logger.debug(`Error creating user:${error.message}`);
            throw error;
        }
    }

    async getLastSavedUser() {
        try {
            const user = await UserModel.findOne().sort({_id: -1});
            if (user) {
                logger.info(`User found:${user.name}`);
                return user;
            } else {
                logger.info('User not found');
                return null;
            }
        } catch (error) {
            throw error;
        }
    }

    async clear() {
        try {
            await UserModel.deleteMany({});
            logger.info('Database cleared');
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserRepository;