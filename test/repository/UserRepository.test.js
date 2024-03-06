const mongoose = require('mongoose');
const UserRepository = require('../../src/repository/UserRepository');

beforeAll(async () => {
    // Connect to a test database before running the tests
    await mongoose.connect('mongodb://localhost:27017/test');
});

afterAll(async () => {
    // Disconnect from the test database after running the tests
    await mongoose.disconnect();
});

describe('UserRepository', () => {
    let userRepository;

    beforeEach(() => {
        userRepository = new UserRepository();
    })

    afterEach(async () => {
        // Clean up the database after each test
        await userRepository.clear();
    });

    it('should create a new user', async () => {
        const newUser = await userRepository.createUser('John', 'High', 'Free');

        expect(newUser).toBeDefined();
        expect(newUser.name).toBe('John');
        expect(newUser.accessibility).toBe('High');
        expect(newUser.price).toBe('Free');
    });

    it('should get the last saved user', async function () {
        const newUser1 = await userRepository.createUser('John', 'High', 'High');
        const newUser2 = await userRepository.createUser('Kevin', 'Low', 'Free');
        const newUser3 = await userRepository.createUser('Joe', 'Medium', 'Low');

        let lastSavedUser = await userRepository.getLastSavedUser();

        expect(lastSavedUser).toBeDefined();
        expect(lastSavedUser.name).toBe(newUser3.name);
        expect(lastSavedUser.accessibility).toBe(newUser3.accessibility);
        expect(lastSavedUser.price).toBe(newUser3.price);

        const newUser4 = await userRepository.createUser('David', 'Medium', 'Free');

        lastSavedUser = await userRepository.getLastSavedUser();

        expect(lastSavedUser).toBeDefined();
        expect(lastSavedUser.name).toBe(newUser4.name);
        expect(lastSavedUser.accessibility).toBe(newUser4.accessibility);
        expect(lastSavedUser.price).toBe(newUser4.price);
    });
});
