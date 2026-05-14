jest.mock("@dicebear/core", () => ({
    createAvatar: () => ({ toDataUri: () => "mock-avatar" })
}));

jest.mock("@dicebear/collection", () => ({
    initials: {}
}));

beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
});

const request = require("supertest");
const app = require("../app");
const prisma = require("../lib/prisma");

afterAll(async () => {
    await prisma.$disconnect();
});

describe("Login Tests using Supertest", () => {

    test("1. correct username and password", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ 
                email: "jerry.agsunod@rethink.edu", 
                password: "password123" 
            });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.email).toBe("jerry.agsunod@rethink.edu");
    });

    test("2. incorrect username", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ 
                email: "doesnotexist@fake.com", 
                password: "password123" 
            });

        expect(res.status).toBe(401);
        expect(res.body.token).toBeUndefined();
    });

    test("3. incorrect password", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ 
                email: "jerry.agsunod@rethink.edu", 
                password: "wrongpassword" 
            });

        expect(res.status).toBe(401);
        expect(res.body.token).toBeUndefined();
    });

    test("4. empty email and password", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "", password: "" });

        expect(res.status).toBe(401); 
        expect(res.body.token).toBeUndefined();
    });

    test("5. empty email only", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "", password: "password123" });

        expect(res.status).toBe(401);
        expect(res.body.token).toBeUndefined();
    });

    test("6. empty password only", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ 
                email: "jerry.agsunod@rethink.edu", 
                password: "" 
            });

        expect(res.status).toBe(401);
        expect(res.body.token).toBeUndefined();
    });

});