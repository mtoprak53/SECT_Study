process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require('../app');
let items = require('../fakeDb');

let bounty = { name: "Bounty", price: 2.49 };
// let snickers = { name: "Snickers", price: 1.99 };

beforeEach(() => items.push(bounty));
afterEach(() => items.length = 0);

describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get('/items');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([bounty]);
  });
});

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app)
      .get(`/items/${bounty.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(bounty);
  });
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).get(`/items/mars`);
    expect(res.statusCode).toBe(404);
  });
});

describe("POST /items", () => {
  test("Creating an item", async () => {
    const gobblers = { name: "Gobblers", price: 1.29 }
    const res = await request(app)
                  .post('/items')
                  .send(gobblers);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ "added": gobblers });
  });
  test("Responds with 400 for empty item", async () => {
    const res = await request(app).post('/items').send({});
    expect(res.statusCode).toBe(400);
  });
});

describe("PATCH /items/:name", () => {
  test("Updating an item", async () => {
    const bountyDark = { name: "Bounty-Dark", price: 2.99 };
    const res = await request(app)
                        .patch(`/items/${bounty.name}`)
                        .send(bountyDark);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ "updated": bountyDark });
  });
  test("Responds with 404 for invalid name", async () => {
    const bountyDark = { name: "Bounty-Dark", price: 2.99 };
    const res = await request(app)
                        .patch('/items/Oreo')
                        .send(bountyDark);
    expect(res.statusCode).toBe(404);
  })
});

describe("DELETE /items/:name", () => {
  test("Deleting an item", async () => {
    const res = await request(app)
                        .delete(`/items/${bounty.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });    
  });
  test("Responds with 404 for deleting invalid item",
       async () => {
    const res = await request(app).delete(`/items/Nutella`);
    expect(res.statusCode).toBe(404);
  });
});

