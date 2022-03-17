"use strict"

const db = require("../db.js");
const {
  BadRequestError, 
  NotFoundError
} = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach, 
  commonAfterAll,
  jobId1, 
  jobId2,
  jobId3
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/*************************************** create */

describe("create", function () {
  const newJob = {
    title: "newTitle",
    salary: 120000,
    equity: 0.003,
    companyHandle: "c2"
  };

  // console.log(idArr);

  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual({
      id: expect.any(Number), 
      ...newJob, 
      equity: "0.003"
    });

    const result = await db.query(
          `SELECT title, salary, equity, company_handle 
           FROM jobs 
           WHERE id = $1`,
        [job.id]);
    expect(result.rows).toEqual([
      {
        // id: expect.any(Number),
        title: "newTitle",
        salary: 120000,
        equity: "0.003",
        // equity: 0.003,
        company_handle: "c2"
      }
    ]);
  });
  
  // DO WE NEED TEST FOR DUPE ??
});

/************************************** findAll */

describe("findAll", function () {

  // console.log(idArr);
  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        // id: expect.any(Number),
        id: jobId1,
        title: "j1",
        salary: 100000,
        equity: "0.01",
        // equity: 0.01,
        companyHandle: "c1"
      },
      {
        // id: expect.any(Number),
        id: jobId2,
        title: "j2",
        salary: 200000,
        equity: null,
        // equity: 0.02,
        companyHandle: "c2"
      },
      {
        // id: expect.any(Number),
        id: jobId3,
        title: "j3",
        salary: 300000,
        equity: "0.03",
        // equity: 0.03,
        companyHandle: "c3"
      },
    ]);
  });

  test("works: title filter", async function () {
    let jobs = await Job.findAll({ title: "3" });
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "j3",
        salary: 300000,
        equity: "0.03",
        // equity: 0.03,
        companyHandle: "c3"
      },
    ]);
  });

  test("fails: title filter - wrong value type", async function () {
    try {
      await Job.findAll({ title: true });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("works: minSalary filter", async function () {
    let jobs = await Job.findAll({ minSalary: 200000 });
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "j2",
        salary: 200000,
        equity: null,
        // equity: 0.02,
        companyHandle: "c2"
      },
      {
        id: expect.any(Number),
        title: "j3",
        salary: 300000,
        equity: "0.03",
        // equity: 0.03,
        companyHandle: "c3"
      },
    ]);
  });

  test("fails: minSalary filter - wrong value type", async function () {
    try {
      await Job.findAll({ minSalary: "not-a-number" });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("works: hasEquity filter", async function () {
    let jobs = await Job.findAll({ hasEquity: true });
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "j1",
        salary: 100000,
        equity: "0.01",
        // equity: 0.01,
        companyHandle: "c1"
      },
      {
        id: expect.any(Number),
        title: "j3",
        salary: 300000,
        equity: "0.03",
        // equity: 0.03,
        companyHandle: "c3"
      },
    ]);
  });

  test("fails: hasEquity filter - wrong value type", async function () {
    try {
      await Job.findAll({ hasEquity: 18 });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  // console.log(idArr);
  test("works: all filter terms", async function () {
    let jobs = await Job.findAll({
      title: "j",
      minSalary: 200000,
      hasEquity: true
    });
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "j3",
        salary: 300000,
        equity: "0.03",
        // equity: 0.03,
        companyHandle: "c3"
      },
    ]);
  });

  // console.log(idArr);
  test("works: some filter terms in different order", async function () {
    let jobs = await Job.findAll({
      minSalary: 200000,
      title: "j",
    });
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "j2",
        salary: 200000,
        equity: null,
        // equity: 0.02,
        companyHandle: "c2"
      },
      {
        id: expect.any(Number),
        title: "j3",
        salary: 300000,
        equity: "0.03",
        // equity: 0.03,
        companyHandle: "c3"
      },
    ]);
  });

  // console.log(idArr);
  test("no result: all filter terms", async function () {
    let jobs = await Job.findAll({
      title: "j",
      minSalary: 400000,
      hasEquity: true
    });
    expect(jobs).toEqual([ ]);
  });


});

/************************************** get */

describe("get", function () {
  const newJob2 = {
    title: "newTitle2",
    salary: 125000,
    equity: 0.009,
    companyHandle: "c3"
  };

  test("works", async function () {
    let createJob = await Job.create(newJob2);
    let getJob = await Job.get(createJob.id);
    expect(getJob).toEqual({
      id: createJob.id,
      title: "newTitle2",
      salary: 125000,
      equity: "0.009",
      // equity: 0.009,
      companyHandle: "c3"
    });
  });

  test("not found if no such job id", async function () {
    try {
      await Job.get();
      fail();
    }
    catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const newJob3 = {
    title: "newTitle3",
    salary: 155000,
    equity: 0.011,
    companyHandle: "c1"
  };
  const updateData = {
    title: "New",
    salary: 225000,
    equity: 0.033
  };
  const updateDataSetNulls = {
    title: "New",
    salary: null,
    equity: null
  };

  test("works", async function () {
    let createJob3 = await Job.create(newJob3);
    let id3 = createJob3.id;
    let job = await Job.update(id3, updateData);
    expect(job).toEqual({
      id: id3,
      ...updateData,
      equity: "0.033",
      companyHandle: "c1"
    });

    const result = await db.query(
          `SELECT id, title, salary, equity, company_handle 
          FROM jobs 
          WHERE id = ${id3}`
    );
    expect(result.rows).toEqual([
      {
        id: id3,
        title: "New",
        salary: 225000,
        equity: "0.033",
        // equity: 0.033,
        company_handle: "c1"
      }
    ]);
  });
  
  test("works: null fields", async function () {
    let createJob3 = await Job.create(newJob3);
    let id3 = createJob3.id;
    let job = await Job.update(id3, updateDataSetNulls);
    expect(job).toEqual({
      id: id3,
      ...updateDataSetNulls,
      companyHandle: "c1"
    });

    const result = await db.query(
          `SELECT id, title, salary, equity, company_handle 
          FROM jobs 
          WHERE id = ${id3}`
    );
    expect(result.rows).toEqual([
      {
        id: id3,
        title: "New",
        salary: null,
        equity: null,
        company_handle: "c1"
      }
    ]);
  });
  
  test("not found if no such job", async function () {
    try {
      await Job.update(0, updateData);
      fail();
    }
    catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
  
  test("bad request with no data", async function () {
    let createJob3 = await Job.create(newJob3);
    let id3 = createJob3.id;
    try {
      await Job.update(id3, {});
      fail();
    }
    catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  const newJob4 = {
    title: "newTitle4",
    salary: 140000,
    equity: 0.014,
    companyHandle: "c2"
  };

  test("works", async function () {
    let createJob4 = await Job.create(newJob4);
    let id4 = createJob4.id;
    await Job.remove(id4);
    const res = await db.query(
      `SELECT id FROM jobs WHERE id = ${id4}`
    );
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Job.remove(0);
      fail();
    }
    catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});





















