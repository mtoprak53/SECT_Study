"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");
const Job = require("../models/job");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,   // user
  u2Token,   // admin
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

describe("POST /jobs", function () {
  const newJob = {
    title: "new",
    salary: 115000,
    equity: 0.022,
    companyHandle: "c1"
  };

  test("ok for admins", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send(newJob)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      id: expect.any(Number),
      ...newJob,
      equity: "0.022"      
    });
  });

  test("not admin -> unauthorized", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send(newJob)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send({
          title: "new",
          salary: 135000,
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send({
          ...newJob,
          companyHandle: "",
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /jobs */

describe("GET /jobs", function () {
  test("ok for annon", async function () {
    const resp = await request(app).get("/jobs");
    expect(resp.body).toEqual({
      jobs: 
          [
            {
              id: 1,
              title: "j1",
              salary: 150000,
              equity: "0.031",
              companyHandle: "c1"
            },
            {
              id: 2,
              title: "j2",
              salary: 160000,
              equity: "0.032",
              companyHandle: "c3"
            },
            {
              id: 3,
              title: "j3",
              salary: 170000,
              equity: "0.033",
              companyHandle: "c3"
            }
          ]
    });
  });

  test("fails: test next() handler", async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query("DROP TABLE jobs CASCADE");
    const resp = await request(app)
        .get("/jobs")
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(500);
  });
});


/************************************** GET /jobs/:id */

describe("GET /jobs/:id", function () {
  const newJob = {
    title: "J4",
    salary: 180000,
    equity: 0.034,
    companyHandle: "c2"
  };

  test("works for anon", async function () {
    const j = await Job.create(newJob);
    const resp = await request(app).get(`/jobs/${j.id}`);
    expect(resp.body).toEqual({
      job: {
        id: j.id,
        title: "J4",
        salary: 180000,
        equity: "0.034",
        companyHandle: "c2"
      }
    });
  });

  test("not found for no such job", async function () {
    const resp = await request(app).get(`/jobs/0`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /jobs/:id */

describe("PATCH /jobs/:id", function () {
  const newJob = {
    title: "J4",
    salary: 180000,
    equity: 0.034,
    companyHandle: "c2"
  };

  test("works for admins", async function () {
    const j = await Job.create(newJob);
    // console.log(j.id);
    const resp = await request(app)
        .patch(`/jobs/${j.id}`)
        .send({ title: "J4-new" })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.body).toEqual({
      job: {
        id: j.id,
        ...newJob,
        title: "J4-new",
        equity: "0.034",
      }
    });
  });

  test("unauth for no-admin", async function () {
    const j = await Job.create(newJob);
    // console.log(j.id);
    const resp = await request(app)
        .patch(`/jobs/${j.id}`)
        .send({ title: "J4-new" })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for for anon", async function () {
    const j = await Job.create(newJob);
    // console.log(j.id);
    const resp = await request(app)
        .patch(`/jobs/${j.id}`)
        .send({ title: "J4-new" });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found on no such company", async function () {
    const resp = await request(app)
        .patch(`/jobs/0`)
        .send({ title: "new 0" })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request on companyHandle change attempt", async function () {
    const j = await Job.create(newJob);
    // console.log(j.id);
    const resp = await request(app)
        .patch(`/jobs/${j.id}`)
        .send({ companyHandle: "c2-new" })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request on invalid data", async function () {
    const j = await Job.create(newJob);
    // console.log(j.id);
    const resp = await request(app)
        .patch(`/jobs/${j.id}`)
        .send({ salary: "" })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /jobs/:id */

describe("DELETE /jobs/:id", function () {
  const newJob = {
    title: "J4",
    salary: 180000,
    equity: 0.034,
    companyHandle: "c2"
  };

  test("works for admins", async function () {
    const j = await Job.create(newJob);
    const resp = await request(app)
        .delete(`/jobs/${j.id}`)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.body).toEqual({ deleted: `${j.id}` });
  });

  test("unauth for no-admin", async function () {
    const j = await Job.create(newJob);
    const resp = await request(app)
        .delete(`/jobs/${j.id}`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const j = await Job.create(newJob);
    const resp = await request(app)
        .delete(`/jobs/${j.id}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such company", async function () {
    const resp = await request(app)
        .delete(`/jobs/0`)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});
