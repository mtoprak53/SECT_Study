const { BadRequestError } = require("../expressError");

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

function difference(setA, setB) {
  let _difference = new Set(setA);
  for (let elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}

module.exports = { sqlForPartialUpdate, difference };
