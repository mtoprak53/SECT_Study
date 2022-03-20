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

  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual({
      id: expect.any(Number), 
      ...newJob, 
      equity: "0.003"   //  WHY STRING  ??
    });

    const result = await db.query(
          `SELECT title, salary, equity, company_handle 
           FROM jobs 
           WHERE id = $1`,
        [job.id]);
    expect(result.rows).toEqual([{
      title: "newTitle",
      salary: 120000,
      equity: "0.003",
      company_handle: "c2"
    }]);
  });
  
  // DO WE NEED TEST FOR DUPE ??
});

/************************************** findAll */

describe("findAll", function () {

  test("works: no filter", async function () {    
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        id: 1,
        title: "j1",
        salary: 100000,
        equity: "0.01",
        companyHandle: "c1"
      },
      {
        id: 2,
        title: "j2",
        salary: 200000,
        equity: null,
        companyHandle: "c2"
      },
      {
        id: 3,
        title: "j3",
        salary: 300000,
        equity: "0.03",
        companyHandle: "c3"
      },
    ]);
  });

  test("works: title filter", async function () {
    let jobs = await Job.findAll({ title: "3" });
    expect(jobs).toEqual([{
      id: 3,
      title: "j3",
      salary: 300000,
      equity: "0.03",
      companyHandle: "c3"
    }]);
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
        id: 2,
        title: "j2",
        salary: 200000,
        equity: null,
        companyHandle: "c2"
      },
      {
        id: 3,
        title: "j3",
        salary: 300000,
        equity: "0.03",
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
        id: 1,
        title: "j1",
        salary: 100000,
        equity: "0.01",
        companyHandle: "c1"
      },
      {
        id: 3,
        title: "j3",
        salary: 300000,
        equity: "0.03",
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

  test("works: all filter terms", async function () {
    let jobs = await Job.findAll({
      title: "j",
      minSalary: 200000,
      hasEquity: true
    });
    expect(jobs).toEqual([{
      id: 3,
      title: "j3",
      salary: 300000,
      equity: "0.03",
      companyHandle: "c3"
    }]);
  });

  test("works: some filter terms in different order", async function () {
    let jobs = await Job.findAll({
      minSalary: 200000,
      title: "j",
    });
    expect(jobs).toEqual([
      {
        id: 2,
        title: "j2",
        salary: 200000,
        equity: null,
        companyHandle: "c2"
      },
      {
        id: 3,
        title: "j3",
        salary: 300000,
        equity: "0.03",
        companyHandle: "c3"
      },
    ]);
  });

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
  test("works", async function () {
    let getJob = await Job.get(2);
    expect(getJob).toEqual({
      id: 2,
      title: "j2",
      salary: 200000,
      equity: null,
      companyHandle: "c2"
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

/************************************** getHandle */

describe("getHandle", function () {
  test("works", async function () {
    let getJob = await Job.getHandle("c3");
    expect(getJob).toEqual([{
      id: 3,
      title: "j3",
      salary: 300000,
      equity: "0.03"
    }]);
  });

  // test("not found if no such company_handle", async function () {
  //   try {
  //     await Job.getHandle();
  //     fail();
  //   }
  //   catch (err) {
  //     expect(err instanceof NotFoundError).toBeTruthy();
  //   }
  // });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    title: "New",
    salary: 225000,
    equity: 0.033
  };
  // string equity for returns
  const updateData_ = {
    title: "New",
    salary: 225000,
    equity: "0.033"
  };
  const updateDataSetNulls = {
    title: "New",
    salary: null,
    equity: null
  };

  test("works", async function () {
    let job = await Job.update(1, updateData);
    expect(job).toEqual({
      id: 1,
      ...updateData_,
      companyHandle: "c1"
    });

    const result = await db.query(
          `SELECT id, title, salary, equity, company_handle 
          FROM jobs 
          WHERE id = 1`
    );
    expect(result.rows).toEqual([{
      id: 1,
      ...updateData_,
      company_handle: "c1"
    }]);
  });
  
  test("works: null fields", async function () {
    let job = await Job.update(2, updateDataSetNulls);
    expect(job).toEqual({
      id: 2,
      ...updateDataSetNulls,
      companyHandle: "c2"
    });

    const result = await db.query(
          `SELECT id, title, salary, equity, company_handle 
          FROM jobs 
          WHERE id = 2`
    );
    expect(result.rows).toEqual([{
      id: 2,
      ...updateDataSetNulls,
      company_handle: "c2"
    }]);
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
    try {
      await Job.update(3, {});
      fail();
    }
    catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Job.remove(2);
    const res = await db.query(
      `SELECT id FROM jobs WHERE id = 2`
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
