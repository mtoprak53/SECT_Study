/** Tests for the book model. */


const db = require("../db");
const Book = require("../models/book");


describe("Test Book class", () => {
  beforeEach(async () => {
    await db.query(`DELETE FROM books`);

    let b1 = await Book.create({      
      isbn: "0691161518",
      amazon_url: "http://a.co/eobPtX2",
      author: "Matthew Lane",
      language: "english",
      pages: 264,
      publisher: "Princeton University Press",
      title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
      year: 2017
    });    
  });

  describe("", () => {
    test("can create a book", async () => {
      const b2 = {
        isbn: "‎ 0735211299",
        amazon_url: "https://www.amazon.com/dp/0735211299/ref=s9_acsd_ri_bw_c2_x_5_i?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-10&pf_rd_r=5ET44V8WG7ESAPAYN7JY&pf_rd_t=101&pf_rd_p=ec1034ac-997c-47fd-8075-3a3a4b4c3aa3&pf_rd_i=283155",
        author: "James Clear",
        language: "english",
        pages: 320,
        publisher: "Avery",
        title: "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones",
        year: 2018
      }
      let b = await Book.create(b2);
      expect(b).toEqual({
        isbn: "‎ 0735211299",
        amazon_url: "https://www.amazon.com/dp/0735211299/ref=s9_acsd_ri_bw_c2_x_5_i?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-10&pf_rd_r=5ET44V8WG7ESAPAYN7JY&pf_rd_t=101&pf_rd_p=ec1034ac-997c-47fd-8075-3a3a4b4c3aa3&pf_rd_i=283155",
        author: "James Clear",
        language: "english",
        pages: 320,
        publisher: "Avery",
        title: "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones",
        year: 2018
      });
  
    });
    // test("", async () => {
  
    // });

  });

  // describe("", () => {
  //   test("", async () => {
  
  //   });
  //   test("", async () => {
  
  //   });

  // });

});

afterAll(async () => {
  await db.end();
});


