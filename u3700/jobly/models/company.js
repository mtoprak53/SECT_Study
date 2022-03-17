"use strict";

const db = require("../db");
const { BadRequestError, 
        NotFoundError } = require("../expressError");
const { sqlForPartialUpdate, 
        difference } = require("../helpers/sql");

/** Related functions for companies. */

class Company {
  /** Create a company (from data), update db, return new company data.
   *
   * data should be { handle, name, description, numEmployees, logoUrl }
   *
   * Returns { handle, name, description, numEmployees, logoUrl }
   *
   * Throws BadRequestError if company already in database.
   * */

  static async create({ handle, name, description, numEmployees, logoUrl }) {
    const duplicateCheck = await db.query(
          `SELECT handle
           FROM companies
           WHERE handle = $1`,
        [handle]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate company: ${handle}`);

    const result = await db.query(
          `INSERT INTO companies
           (handle, name, description, num_employees, logo_url)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl"`,
        [
          handle,
          name,
          description,
          numEmployees,
          logoUrl,
        ],
    );
    const company = result.rows[0];

    return company;
  }

  /** Find all companies.
   *
   * Returns [{ handle, name, description, numEmployees, logoUrl }, ...]
   * */

  static async findAll(queryString) {
    let querySql = `SELECT handle, 
                           name,
                           description, 
                           num_employees AS "numEmployees", 
                           logo_url AS "logoUrl" 
                    FROM companies`

    // NO FILTER
    if (!queryString) {
      querySql += ` ORDER BY name`;
      const companiesRes = await db.query(querySql);
      return companiesRes.rows;
    }

    // WITH FILTER
    else {
      const keys = Object.keys(queryString);
      const arr = ["WHERE", "AND", "AND"];
      const universe = new Set(["nameLike", "minEmployees", "maxEmployees"]);

      // BadRequestError if there is any inappropriate filter terms
      const set1 = new Set(keys);
      // console.log(set1);
      // console.log(universe);
      // console.log(difference(set1, universe));
      if (difference(set1, universe).size > 0) {
        throw new BadRequestError("There is at least one inappropriate filtering term in the query.");
      }

      // BadRequestError if minEmployees > maxEmployees
      if (keys.includes("minEmployees") && 
          keys.includes("maxEmployees") && 
          queryString["minEmployees"] > queryString["maxEmployees"]) {
        throw new BadRequestError("minEmployees cannot exceed maxEmployees.");
      }

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
      // console.log(querySql);
      // console.log(Object.values(queryString));
      const valArr = Object.entries(queryString).map(ent => {
        return ent[0] === "nameLike" ? `%${ent[1]}%` : parseInt(ent[1]);
      });
      const companiesRes = await db.query(querySql, valArr);
      return companiesRes.rows;
    }
  }

  /** Given a company handle, return data about company.
   *
   * Returns { handle, name, description, numEmployees, logoUrl, jobs }
   *   where jobs is [{ id, title, salary, equity, companyHandle }, ...]
   *
   * Throws NotFoundError if not found.
   **/

  static async get(handle) {
    const companyRes = await db.query(
          `SELECT handle,
                  name,
                  description,
                  num_employees AS "numEmployees",
                  logo_url AS "logoUrl"
           FROM companies
           WHERE handle = $1`,
        [handle]);

    const company = companyRes.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);

    const jobRes = await db.query(
          `SELECT id,
                  title, 
                  salary, 
                  equity, 
                  company_handle AS "companyHandle" 
            FROM jobs 
            WHERE company_handle = $1`,
          [handle]);
    
    const jobs = jobRes.rows;

    return { ...company, jobs };
  }

  /** Update company data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {name, description, numEmployees, logoUrl}
   *
   * Returns {handle, name, description, numEmployees, logoUrl}
   *
   * Throws NotFoundError if not found.
   */

  static async update(handle, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          numEmployees: "num_employees",
          logoUrl: "logo_url",
        });
    const handleVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE companies 
                      SET ${setCols} 
                      WHERE handle = ${handleVarIdx} 
                      RETURNING handle, 
                                name, 
                                description, 
                                num_employees AS "numEmployees", 
                                logo_url AS "logoUrl"`;
    const result = await db.query(querySql, [...values, handle]);
    const company = result.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);

    return company;
  }

  /** Delete given company from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove(handle) {
    const result = await db.query(
          `DELETE
           FROM companies
           WHERE handle = $1
           RETURNING handle`,
        [handle]);
    const company = result.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);
  }
}


module.exports = Company;
