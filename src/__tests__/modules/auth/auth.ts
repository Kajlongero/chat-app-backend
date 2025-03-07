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

describe("POST /api/v1/auth/refresh-token", () => {
  it("should throw a 401 error", async () => {
    const response = await request(app).post("/api/v1/auth/refresh-token");

    expect(response.status).toBe(401);
  });
  it("should create an user and refresh the session without problems", async () => {
    const res = await request(app)
      .post("/api/v1/auth/sign-up")
      .send(authMocks.refresh.correct);

    const token = res.body.data.refreshToken as string;

    const response = await request(app)
      .post("/api/v1/auth/refresh-token")
      .send({
        refreshToken: token,
      });

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
  });
});

describe("POST /api/v1/auth/*", () => {
  it("should signup, refresh the session and close session", async () => {
    const res = await request(app)
      .post("/api/v1/auth/sign-up")
      .send(authMocks.authRefreshAndClose.signupCorrect);

    const sRefresh = res.body.data.refreshToken;

    const ref = await request(app).post("/api/v1/auth/refresh-token").send({
      refreshToken: sRefresh,
    });

    const aRefresh = ref.body.data.accessToken;
    const rRefresh = ref.body.data.refreshToken;

    const act = await request(app)
      .post("/api/v1/auth/close-session")
      .send({
        refreshToken: rRefresh,
      })
      .set("Authorization", `Bearer ${aRefresh}`);

    expect(act.status).toBe(200);
    expect(act.body.data).toBe(true);
  });
  it("should login and refresh the session and close it", async () => {
    const res = await request(app)
      .post("/api/v1/auth/log-in")
      .send(authMocks.authRefreshAndClose.loginCorrect);

    console.log(res);

    const sRefresh = res.body.data.refreshToken;

    const ref = await request(app).post("/api/v1/auth/refresh-token").send({
      refreshToken: sRefresh,
    });

    const rRefresh = ref.body.data.refreshToken;
    const aRefresh = ref.body.data.accessToken;

    const act = await request(app)
      .post("/api/v1/auth/close-session")
      .send({
        refreshToken: rRefresh,
      })
      .set("Authorization", `Bearer ${aRefresh}`);

    expect(act.status).toBe(200);
    expect(act.body.data).toBe(true);
  });

  it("should login and close the session", async () => {
    const res = await request(app)
      .post("/api/v1/auth/log-in")
      .send(authMocks.authRefreshAndClose.loginCorrect);

    const sRefresh = res.body.data.refreshToken;
    const aRefresh = res.body.data.accessToken;

    const act = await request(app)
      .post("/api/v1/auth/close-session")
      .send({
        refreshToken: sRefresh,
      })
      .set("Authorization", `Bearer ${aRefresh}`);

    expect(act.status).toBe(200);
    expect(act.body.data).toBe(true);
  });

  it("should login two times and close the first login session with the second one", async () => {
    const log1 = await request(app)
      .post("/api/v1/auth/log-in")
      .send(authMocks.authRefreshAndClose.loginCorrect);

    const log1sid = log1.body.data.sessionId;

    const log2 = await request(app)
      .post("/api/v1/auth/log-in")
      .send(authMocks.authRefreshAndClose.loginCorrect);

    const rtlog2 = log2.body.data.refreshToken;
    const atlog2 = log2.body.data.accessToken;

    const close = await request(app)
      .post("/api/v1/auth/close-other-session")
      .send({
        sessionId: log1sid,
        refreshToken: rtlog2,
      })
      .set("Authorization", `Bearer ${atlog2}`);

    expect(close.status).toBe(200);
    expect(close.body.data).toBe(true);
  });

  it("should create and delete the created user", async () => {
    const req = await request(app)
      .post("/api/v1/auth/sign-up")
      .send(authMocks.authCreateAndDelete.createCorrect);

    const access = req.body.data.accessToken;
    const refresh = req.body.data.refreshToken;

    const del = await request(app)
      .delete("/api/v1/auth/delete-user")
      .send({ refreshToken: refresh })
      .set("Authorization", `Bearer ${access}`);

    expect(del.status).toBe(200);
    expect(del.headers["content-type"]).toBe("application/json; charset=utf-8");
  });
});
