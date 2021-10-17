process.env.NODE_ENV = 'test';

const request = require("supertest");
const app = require("../app");
const db = require("../db");

let testCom, testInv, testInv2, testInv3, t, y, m, d;

beforeEach(async () => {
  const comRes = await db.query(
    `INSERT INTO companies (code, name, description) 
    VALUES ('dell', 'Dell Technologies', 'My First Laptop')
    RETURNING code, name, description`
  );
  testCom = comRes.rows[0];
  const invRes = await db.query(
    `INSERT INTO invoices (comp_code, amt) 
    VALUES ('dell', 500)
    RETURNING id, comp_code, amt, paid, add_date, paid_date`
  );
  testInv = invRes.rows[0];
  testInv.add_date = testInv.add_date.toISOString();
  testInv2 = {
    id: testInv.id, 
    comp_code: testInv.comp_code
  }
  testInv3 = { ...testInv }  // to avoid they become same
  testInv3.company = testCom;
  // delete testInv3.comp_code;
  t = new Date();
  y = t.getFullYear();
  m = t.getMonth();
  d = t.getDate();
});

afterEach(async () => {
  await db.query(`DELETE FROM companies`);  // cascade on del
});

afterAll(async () => {
  await db.end();
});

// describe("Hope this works!!", () => {
//   test("BLAH BLAH BALH", () => {
//     // console.log(testCom);
//     expect(1).toBe(1);
//   });
// });


// COMPANIES

// GET /companies
describe("GET /companies", () => {
  test("Get a list with one company", async () => {
    const res = await request(app).get(`/companies`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ companies: [testCom] });
  });
});


// GET /companies/:code
describe("GET /companies/:code", () => {
  test("Get a single company", async () => {
    const res = await request(app).get(`/companies/${testCom.code}`);
    expect(res.statusCode).toBe(200);
    testCom.invoices = [testInv];
    expect(res.body).toEqual({ company: testCom });
  });
  test("Respond with 404 for invalid code", async () => {
    const res = await request(app).get(`/companies/xxxx`);
    expect(res.statusCode).toBe(404);
  })
});

// POST /companies
describe("POST /companies", () => {
  test("Create a single company", async () => {
    const res = await request(app).post('/companies').send({ code: 'google', name: 'Google', description: 'Big Brother'});
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      company: {
        code: 'google', name: 'Google', description: 'Big Brother'
      }
    });
  });
});

// PUT /companies/:code
describe("PUT /companies/:code", () => {
  test("Update a single company", async () => {
    const res = await request(app)
                      .put(`/companies/${testCom.code}`)
                      .send({
                        name: "Gugli", 
                        description: "Ferhat Guzel version"
                      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      company: {
        code: testCom.code, 
        name: "Gugli", 
        description: "Ferhat Guzel version"
      }
    });
  });
  test("Respond with 404 for invalid code", async () => {
    const res = await request(app)
                      .put(`/companies/invalid_comp_code`)
                      .send({
                        name: "Gugli", 
                        description: "Ferhat Guzel version"
                      });
    expect(res.statusCode).toBe(404);
  });
});

// DELETE /companies/:code
describe("DELETE /companies/:code", () => {
  test("Delete a single company", async () => {
    const res = await request(app)
                      .delete(`/companies/${testCom.code}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "deleted" });
  });
});


//INVOICES

// GET /invoices
describe("GET /invoices", () => {
  test("Get the list of all invoices", async () => {
    const res = await request(app).get(`/invoices`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ invoices: [testInv2] });
  });
});

// GET /invoices/:id
describe("GET /invoices/:id", () => {
  test("Get a single invoice", async () => {
    const res = await request(app).get(`/invoices/${testInv.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ invoice: testInv3 });
  });
  test("Respond with 404 for invalid id", async () => {
    const res = await request(app).get(`/invoices/0`);
    expect(res.statusCode).toBe(404);
  });
});

// POST /invoices/
describe("POST /invoices", () => {
  test("Create an invoice", async () => {
    const res = await request(app).post(`/invoices`).send({
      comp_code: 'dell', amt: 675
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      invoice: {
        id: expect.any(Number),
        comp_code: 'dell',
        amt: 675,
        paid: false,
        add_date: new Date(y, m, d).toISOString(),
        paid_date: null
      }
    });
  });
});

// PUT /invoices/:id
describe("PUT /invoices/:id", () => {
  test("Update an invoice", async () => {
    const res = await request(app)
                      .put(`/invoices/${testInv.id}`)
                      .send({ amt: 825 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      invoice: {
        id: expect.any(Number),
        comp_code: 'dell',
        amt: 825,
        paid: false,
        add_date: new Date(y, m, d).toISOString(),
        paid_date: null
      }
    })
  });
  test("Respond with 404 for invalid id", async () => {
    const res = await request(app).put(`/invoices/0`).send({ amt: 999 });
    expect(res.statusCode).toBe(404);
  });
});

// DELETE /invoices/:id
describe("DELETE /invoices/:id", () => {
  test("Delete an invoice", async () => {
    const res = await request(app).delete(`/invoices/${testInv.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "deleted" });
  });
});
