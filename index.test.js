const request = require("supertest");
// express app
const app = require("./index");

// db setup
const {sequelize, Dog} = require("./db");
const seed = require("./db/seedFn");
const {dogs} = require("./db/seedData");

describe("Endpoints", () => {
	// to be used in POST test
	const testDogData = {
		breed: "Poodle",
		name: "Sasha",
		color: "black",
		description:
			"Sasha is a beautiful black pooodle mix.  She is a great companion for her family.",
	};

	beforeAll(async () => {
		// rebuild db before the test suite runs
		await seed();
	});

	describe("GET /dogs", () => {
		it("should return list of dogs with correct data", async () => {
			// make a request
			const response = await request(app).get("/dogs");
			// assert a response code
			expect(response.status).toBe(200);
			// expect a response
			expect(response.body).toBeDefined();
			// toEqual checks deep equality in objects
			expect(response.body[0]).toEqual(expect.objectContaining(dogs[0]));
		});
	});

	describe("POST /dogs", () => {
		it("should return the specifically added dog", async () => {
			const response = await request(app).post("/dogs").send(testDogData);
			expect(response.status).toBe(200);
			expect(response.body).toBeDefined();
			expect(response.body).toMatchObject(testDogData);
		});

		it("checking dog has been added to the database", async () => {
			const response = await request(app).post("/dogs").send(testDogData);
			const dogID = response.body.id;
			const retrievedDog = await Dog.findByPk(dogID);
			expect(retrievedDog).toMatchObject(testDogData);
		});
	});

	describe("GET /dogs/:id", () => {
		it("should return the specifically asked for dog", async () => {
			const response = await request(app).get("/dogs/7");
			expect(response.status).toBe(200);
			expect(response.body).toBeDefined();
			expect(response.body).toMatchObject(testDogData);
		});

		it("should return error message when dog with invalid ID is requested", async () => {
			const response = await request(app).get("/dogs/37");
			expect(response.status).toBe(404);
			expect(response).toBeDefined();
			expect(response.text).toEqual(`Dog with id 37 not found`);
		});
	});

	describe("DELETE /dogs/:id", () => {
		it("should delete dog with given id", async () => {
			const response = await request(app).delete("/dogs/1");
			expect(response.status).toBe(200);
			expect(response).toBeDefined();
			expect(response.text).toEqual(`deleted dog with id 1`);
		});

		it("check the dog is no longer in the database", async () => {
			const noDog = await Dog.findByPk(1);
			expect(noDog).toBeNull();
		});

		it("should return error message when dog with non valid ID is tried", async () => {
			const response = await request(app).delete("/dogs/37");
			expect(response.status).toBe(404);
			expect(response).toBeDefined();
			expect(response.text).toEqual(`Dog with id 37 not found`);
		});
	});
});
