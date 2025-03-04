import request from "supertest";
import { app } from "../../..";

import { authMocks } from "../../../__mocks__/auth.data";

describe("POST /api/v1/auth/sign-up", () => {
  it("Should throw a 400 due to bad email error", async () => {
    const response = await request(app)
      .post("/api/v1/auth/sign-up")
      .send(authMocks.register.badEmail);

    expect(response.status).toBe(400);
  });
  it("Should throw a 400 due to bad bad password length less than 8 error", async () => {
    const response = await request(app)
      .post("/api/v1/auth/sign-up")
      .send(authMocks.register.badPasswordLengthLessThan8);

    expect(response.status).toBe(400);
  });
  it("Should throw a 400  due to bad bad password length higher than 32 error", async () => {
    const response = await request(app)
      .post("/api/v1/auth/sign-up")
      .send(authMocks.register.badPasswordLengthHigherThan32);

    expect(response.status).toBe(400);
  });
  it("Should throw a 400 due to username length less than 3 error", async () => {
    const response = await request(app)
      .post("/api/v1/auth/sign-up")
      .send(authMocks.register.badUsernameLengthLessThan3);

    expect(response.status).toBe(400);
  });
  it("Should throw a 400  due to bad bad username length higher than 64 error", async () => {
    const response = await request(app)
      .post("/api/v1/auth/sign-up")
      .send(authMocks.register.badUsernameLengthHigherThan64);

    expect(response.status).toBe(400);
  });
  it("Should create a new user", async () => {
    const response = await request(app)
      .post("/api/v1/auth/sign-up")
      .send(authMocks.register.correct);

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
  });
  it("it should throw a conflict due to a email or username unique violation error", async () => {
    const response = await request(app)
      .post("/api/v1/auth/sign-up")
      .send(authMocks.register.correct);

    expect(response.status).toBe(409);
    expect(response.headers["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
  });
});

describe("POST /api/v1/auth/log-in", () => {
  it("Should throw a 400 due to bad email error", async () => {
    const response = await request(app)
      .post("/api/v1/auth/log-in")
      .send(authMocks.login.badEmail);

    expect(response.status).toBe(400);
  });
  it("Should throw a 400 due to bad bad password length less than 8 error", async () => {
    const response = await request(app)
      .post("/api/v1/auth/log-in")
      .send(authMocks.login.badPasswordLengthLessThan8);

    expect(response.status).toBe(400);
  });
  it("Should throw a 400  due to bad bad password length higher than 32 error", async () => {
    const response = await request(app)
      .post("/api/v1/auth/log-in")
      .send(authMocks.login.badPasswordLengthHigherThan32);

    expect(response.status).toBe(400);
  });
  it("it should throw a 401 unauthorized error", async () => {
    const response = await request(app)
      .post("/api/v1/auth/log-in")
      .send(authMocks.login.notExistsEmail);

    expect(response.status).toBe(401);
  });
  it("it should throw a 401 unauthorized error", async () => {
    const response = await request(app)
      .post("/api/v1/auth/log-in")
      .send(authMocks.login.existsButWrongPassword);

    expect(response.status).toBe(401);
  });
  it("it should login successfully", async () => {
    const response = await request(app)
      .post("/api/v1/auth/log-in")
      .send(authMocks.login.correct);

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
  });
});
