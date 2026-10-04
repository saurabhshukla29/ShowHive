const request = require("supertest");
const app = require("../index"); // adjust path if your entry file has a different name

describe("Basic server health check", () => {
    it("should respond to GET / with a status code (not crash)", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBeLessThan(500);
    });
});

