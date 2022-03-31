const { BadRequestError } = require("../expressError");
const { difference } = require("./difference");

// THIS NEEDS SOME GREAT DOCUMENTATION.

/** Produces the required parts of db query script for partial 
 * updating of users and companies. 
 *
 * This is a "partial update" --- it's fine if data doesn't 
 * contain all the fields; this only changes provided ones.
 *
 * For companies, dataToUpdate can include: 
 *   { name, description, numEmployees, logoUrl }
 *
 * For users, dataToUpdate can include:
 *   { firstName, lastName, password, email, isAdmin }
 * 
 * And jsToSql could be:
 *    { jsKeyName1: "sql_column_name_1", ... }
 * 
 * Returns {
 *           setCols: '"column_1=$1, ..."',
 *           values: [dataToUpdate.value_1, ... ]
 *         }
 * 
 * Throws BadRequestError if dataToUpdate is empty.
 * */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}


/**
 * 
 * 
 * 
 */

function sqlForGetAllCompanies(queryString) {
  const keys = Object.keys(queryString);
  const arr = ["WHERE", "AND", "AND"];
  const universe = new Set(["nameLike", "minEmployees", "maxEmployees"]);

  console.log(queryString);

  // BadRequestError if there is any inappropriate filter terms
  const set1 = new Set(keys);
  if (difference(set1, universe).size > 0) {
    throw new BadRequestError("There is at least one inappropriate filtering term in the query.");
  }

  // BadRequestError if minEmployees > maxEmployees
  if (keys.includes("minEmployees") && 
      keys.includes("maxEmployees") && 
      +queryString["minEmployees"] > +queryString["maxEmployees"]) {
    throw new BadRequestError("minEmployees cannot exceed maxEmployees.");
  }

  let querySql = "";

  // Build the SQL query
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] === "nameLike") {
      querySql += ` ${arr[i]} LOWER(name) LIKE LOWER($${i+1})`;
    }
    if (keys[i] === "minEmployees") {
      querySql += ` ${arr[i]} num_employees >= $${i+1}`;
    }
    if (keys[i] === "maxEmployees") {
      querySql += ` ${arr[i]} num_employees <= $${i+1}`;
    }
  }

  querySql += ` ORDER BY name`;
  const valArr = Object.entries(queryString)
                      .map(ent => ent[0] === "nameLike" ? `%${ent[1]}%` : +ent[1]);

  return [querySql, valArr];
};


/**
 * 
 * 
 * 
 */

function sqlForGetAllJobs(queryString) {
  // filter out empty string values      
  for(let key in queryString) {
    if(queryString[key] === "") {
      delete queryString[key];
    }
  }
  
  const keys = Object.keys(queryString);
  const universe = new Set(["title", "minSalary", "hasEquity"]);
  const set1 = new Set(keys);
  let len = Object.keys(queryString).length;

  // BadRequestError if there is ...
  if (difference(set1, universe).size > 0     // -> ... wrong filter terms
      || len > 3                              // -> ... more than max # of terms
      || len !== set1.size) {                 // -> ... repeating filter terms
    console.log(difference(set1, universe).size);
    console.log(len);
    console.log(set1.size);
    throw new BadRequestError("Please check the filter terms you enter.");
  };

  // BadRequestError if minSalary does not have a number value
  if(keys.includes("minSalary") &&         // -> 'minSalary' exists
     !+queryString["minSalary"] &&         // -> its value is not a non-zero number
     +queryString["minSalary"] !== 0) {    // -> its value is not zero either
    console.log(`minSalary value error => ${queryString["minSalary"]}`);
    throw new BadRequestError("'minSalary' query has to have a number value!")
  };

  // BadRequestError if hasEquity does not have a boolean value
  if(keys.includes("hasEquity") && 
     !["true", "false"].includes(queryString["hasEquity"])) {
    throw new BadRequestError("'hasEquity' query has to have a boolean value!")
  };

  // Construct the SQL Query
  let keyWord;
  let querySql = "";
  const valArr = [];
  const keyWords = ["AND", "AND", "WHERE"];

  if (!!queryString["title"]) {
    keyWord = keyWords.pop();
    querySql += ` ${keyWord} LOWER(title) LIKE LOWER($1)`;
    valArr.push(`%${queryString["title"]}%`);
  };
  
  if (!!queryString["minSalary"]) {
    keyWord = keyWords.pop();
    querySql += ` ${keyWord} salary >= $${3 - keyWords.length}`;
    valArr.push(+queryString["minSalary"]);
  };

  if (!!queryString["hasEquity"] && queryString["hasEquity"] === "true") {
    keyWord = keyWords.pop();
    querySql += ` ${keyWord} equity > 0`;
  };

  querySql += ` ORDER BY id`;

  return [querySql, valArr];
};


module.exports = { sqlForPartialUpdate, sqlForGetAllCompanies, sqlForGetAllJobs };
