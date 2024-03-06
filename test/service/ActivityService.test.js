const ActivityService = require('../../src/service/ActivityService')
const UserService = require('../../src/service/UserService')
const config = require('../../src/config/config')

describe("ActivityService", function () {
    let activityService
    let mockBoredApiResponse = {
        "activity": "Learn Express.js",
        "accessibility": 0.25,
        "type": "education",
        "participants": 1,
        "price": 0.1,
        "link": "https://expressjs.com/",
        "key": "3943506"
    };

    async function verify(mockData, expected) {
        const mockResponse = {ok: true, json: jest.fn().mockResolvedValue(mockData)};
        jest.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

        var activity = await activityService.getRandomActivity();
        expect(activity).toEqual(expected);
    }

    describe('getRandomActivity', function () {
        beforeEach(() => {
            activityService = new ActivityService(null);
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        describe('accessibility property of the activity', function () {
            it("should be 'High' when accessibility <= 0.25", async function () {
                await verify({...mockBoredApiResponse, "accessibility": 0.25},
                    {...mockBoredApiResponse, "accessibility": "High", "price": "Low"});
            });

            it("should return an activity with accessibility as 'Medium' when 0.25 < accessibility <= 0.75", async function () {
                    await verify({...mockBoredApiResponse, "accessibility": 0.55},
                        {...mockBoredApiResponse, "accessibility": "Medium", "price": "Low"})
                }
            );

            it("should return an activity with accessibility as 'Low' when accessibility > 0.75", async function () {
                await verify({...mockBoredApiResponse, "accessibility": 0.9},
                    {...mockBoredApiResponse, "accessibility": "Low", "price": "Low"});
            });
        });

        describe('price property of the activity', function () {
            it("should return an activity with price as 'Free' when price = 0", async function () {
                await verify({...mockBoredApiResponse, "price": 0},
                    {...mockBoredApiResponse, "accessibility": "High", "price": "Free"});
            });

            it("should return an activity with price as 'Low' when price <= 0.5", async function () {
                await verify({...mockBoredApiResponse, "price": 0.5},
                    {...mockBoredApiResponse, "accessibility": "High", "price": "Low"});
            });

            it("should return an activity with price as 'High' when price > 0.5", async function () {
                await verify({...mockBoredApiResponse, "price": 0.6},
                    {...mockBoredApiResponse, "accessibility": "High", "price": "High"});
            });
        });
    });

    describe('getUserActivity', function () {
        let mockUserService;

        beforeEach(() => {
            mockUserService = {
                getCurrentUser: jest.fn()
            }
            activityService = new ActivityService(mockUserService);
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should return a random activity when new user profile', async function () {
            activityService.getRandomActivity = jest.fn();
            activityService.getRandomActivity.mockReturnValue(mockBoredApiResponse)
            mockUserService.getCurrentUser.mockReturnValue(null);

            const activity = await activityService.getUserActivity();
            expect(activityService.getRandomActivity).toHaveBeenCalledTimes(1);
            expect(activity).toEqual(mockBoredApiResponse);
        });

        it('should return an activity matching the current user profile', async function () {
            mockUserService.getCurrentUser.mockReturnValue({name: 'John', accessibility: 'High', price: 'Free'});
            global.fetch = jest.fn();
            global.fetch.mockResolvedValue(
                {
                    ok: true,
                    json: jest.fn().mockResolvedValue(mockBoredApiResponse)
                });

            const activity = await activityService.getUserActivity();

            expect(global.fetch).toBeCalledWith(`${config.boredAPI}?maxaccessibility=0.25&price=0`)
            expect(activity).toEqual({...mockBoredApiResponse, accessibility: 'High', price: 'Free'});
        });

        // TODO more comprehensive tests
    })
});