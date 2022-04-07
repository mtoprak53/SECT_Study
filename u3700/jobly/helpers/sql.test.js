const { BadRequestError } = require("../expressError");
const { sqlForPartialUpdate } = require("./sql");

describe("sqlForPartialUpdate", function () {
  test("works: partial", function () {
    const resp = sqlForPartialUpdate(
      {
        description: "a nice company",
        numEmployees: 100,
        logoUrl: "https://logo.url"
      }, 
      {
        numEmployees: "num_employees",
        logoUrl: "logo_url"
      }
    );
    expect(resp).toEqual({
      setCols: '"description"=$1, "num_employees"=$2, "logo_url"=$3',
      values: ["a nice company", 100, "https://logo.url"]
    });
  });

  test("error: empty dataToUpdate", function () {
    try {
      const resp = sqlForPartialUpdate( { }, { } );
      fail();
    }
    catch(err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});