/** Tests for the books routes. */


const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

let b, b2, b3, b4, u, u2, u3;

beforeEach(async () => {
  await db.query(`DELETE FROM books`);

  // a legit book in db
  b = {      
    isbn: "0691161518",
    amazon_url: "http://a.co/eobPtX2",
    author: "Matthew Lane",
    language: "english",
    pages: 264,
    publisher: "Princeton University Press",
    title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
    year: 2017
  }

  await Book.create(b);

  // a book body with valid schema
  b2 = {      
    isbn: "0735211299",
    amazon_url: "https://www.amazon.com/dp/0735211299/ref=s9_acsd_ri_bw_c2_x_5_i?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-10&pf_rd_r=5ET44V8WG7ESAPAYN7JY&pf_rd_t=101&pf_rd_p=ec1034ac-997c-47fd-8075-3a3a4b4c3aa3&pf_rd_i=283155",
    author: "James Clear",
    language: "english",
    pages: 320,
    publisher: "Avery",
    title: "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones",
    year: 2018
  }

  // an invalid book body with pages info as text
  b3 = {      
    isbn: "0735211299",
    amazon_url: "https://www.amazon.com/dp/0735211299/ref=s9_acsd_ri_bw_c2_x_5_i?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-10&pf_rd_r=5ET44V8WG7ESAPAYN7JY&pf_rd_t=101&pf_rd_p=ec1034ac-997c-47fd-8075-3a3a4b4c3aa3&pf_rd_i=283155",
    author: "James Clear",
    language: "english",
    pages: "320",
    publisher: "Avery",
    title: "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones",
    year: 2018
  }

  // an invalid book body with no author
  b4 = {      
    isbn: "0735211299",
    amazon_url: "https://www.amazon.com/dp/0735211299/ref=s9_acsd_ri_bw_c2_x_5_i?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-10&pf_rd_r=5ET44V8WG7ESAPAYN7JY&pf_rd_t=101&pf_rd_p=ec1034ac-997c-47fd-8075-3a3a4b4c3aa3&pf_rd_i=283155",
    language: "english",
    pages: 320,
    publisher: "Avery",
    title: "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones",
    year: 2018
  }

  // a valid book update body
  u = {
    amazon_url: "https://www.amazon.com/Micro-Habits-sch%C3%A4dliche-Gewohnheiten-etablieren-ebook/dp/B07RWM5DKC/ref=sr_1_2?dchild=1&keywords=atomic+habits+german&qid=1633014239&s=books&sr=1-2",
    author: "Mathias Hammer",
    language: "german",
    pages: 203,
    publisher: "mvg Verlag",
    title: "Micro Habits: Wie Sie schädliche Gewohnheiten stoppen und gute etablieren",
    year: 2019
  }

  // an invalid book update body with pages info as text
  u2 = {
    amazon_url: "https://www.amazon.com/Micro-Habits-sch%C3%A4dliche-Gewohnheiten-etablieren-ebook/dp/B07RWM5DKC/ref=sr_1_2?dchild=1&keywords=atomic+habits+german&qid=1633014239&s=books&sr=1-2",
    author: "Mathias Hammer",
    language: "german",
    pages: "203",
    publisher: "mvg Verlag",
    title: "Micro Habits: Wie Sie schädliche Gewohnheiten stoppen und gute etablieren",
    year: 2019
  }

  // an invalid book update body with no author
  u3 = {
    amazon_url: "https://www.amazon.com/Micro-Habits-sch%C3%A4dliche-Gewohnheiten-etablieren-ebook/dp/B07RWM5DKC/ref=sr_1_2?dchild=1&keywords=atomic+habits+german&qid=1633014239&s=books&sr=1-2",
    language: "german",
    pages: 203,
    publisher: "mvg Verlag",
    title: "Micro Habits: Wie Sie schädliche Gewohnheiten stoppen und gute etablieren",
    year: 2019
  }
});

// afterEach(async () => {
//   await db.query("DELETE FROM books");
// });


describe("POST /books", () => {
  test("can create a book", async () => {
    let response = await request(app)
                          .post("/books")
                          .send(b2);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ book: b2 });
  });

  test("responds with schema error for text pages", async () => {
    let response = await request(app)
                          .post("/books")
                          .send(b3);
    expect(response.statusCode).toBe(400);
    expect(response.body.error.message[0])
      .toEqual("instance.pages is not of a type(s) integer");
  });

  test("responds with schema error for no author", async () => {
    let response = await request(app)
                          .post("/books")
                          .send(b4);
    expect(response.statusCode).toBe(400);
    expect(response.body.error.message[0])
      .toEqual(`instance requires property \"author\"`);
  });
});


describe("PUT /books/:id", () => {
  test("updates a book", async () => {
    let response = await request(app)
                          .put(`/books/${b.isbn}`)
                          .send(u);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ book: {
                                      isbn: b.isbn,
                                      ...u
                                    } 
                                  });
  });

  test("responds with schema error for text pages", async () => {
    let response = await request(app)
                          .put(`/books/${b.isbn}`)
                          .send(u2);
    expect(response.statusCode).toBe(400);
    expect(response.body.error.message[0])
      .toEqual("instance.pages is not of a type(s) integer");
  });

  test("responds with schema error for no author", async () => {
    let response = await request(app)
                          .put(`/books/${b.isbn}`)
                          .send(u3);
    expect(response.statusCode).toBe(400);
    expect(response.body.error.message[0])
      .toEqual(`instance requires property \"author\"`);
  });
});


describe("GET /books", () => {
  test("lists all books.", async () => {
    const response = await request(app).get("/books");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ books: [b] });
  });
});


describe("GET /books/:id", () => {
  test("finds one book.", async () => {
    const response = await request(app)
                            .get(`/books/${b.isbn}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ book: b });
  });

  test("Responds with 404 for invalid id", async () => {
    const response = await request(app).get(`/books/0`);
    expect(response.statusCode).toBe(404);
    expect(response.body.error.message)
      .toEqual(`There is no book with an isbn 0`);
  });
});


describe("DELETE /books/:id", () => {
  test("Deletes single book.", async () => {
    const response = await request(app)
                            .delete(`/books/${b.isbn}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Book deleted" });
  });
});


afterAll(async () => {
  await db.end();
});