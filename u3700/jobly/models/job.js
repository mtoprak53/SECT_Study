"use strict";

const db = require("../db");
const { BadRequestError, 
        NotFoundError } = require("../expressError");
const { sqlForPartialUpdate, 
        difference } = require("../helpers/sql");

/** Related functions for jobs. */
  
class Job {
  
  /** Create a job (from data), update db, return new job data.
   * 
   * data should be { title, salary, equity, companyHandle }
   * 
   * Returns { id, title, salary, equity, companyHandle }
   * 
   * (Throws BadRequestError if job already in database.)
   */

  static async create({ title, salary, equity, companyHandle }) {

    // TO ANSWER  =>  DO WE NEED DUPLICATE CHECK ??

    const result = await db.query(
          `INSERT INTO jobs 
           (title, salary, equity, company_handle) 
           VALUES ($1, $2, $3, $4) 
           RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
        [title, salary, equity, companyHandle]
    );
    const job = result.rows[0];

    return job;
    // return { ...job, equity: parseFloat(job.equity) };
  }

  /** Find all jobs.
   * 
   * Returns [{ id, title, salary, equity, companyHandle }, ... ]
   */

  static async findAll(queryString) {
    let querySql = `SELECT id, 
                           title, 
                           salary, 
                           equity, 
                           company_handle AS "companyHandle" 
                    FROM jobs`

    // NO FILTER
    if(!queryString) {
      querySql += ` ORDER BY id`;
      const jobsRes = await db.query(querySql);
      // jobsRes.rows.map(j => console.log(`job id => ${j.id}`));
      return jobsRes.rows;
    }

    // WITH FILTER
    else {
      const keys = Object.keys(queryString);
      const arr = ["WHERE", "AND", "AND"];
      const universe = new Set(["title", "minSalary", "hasEquity"]);

      // BadRequestError if there is any inappropriate filter terms
      const set1 = new Set(keys);
      // console.log(set1);
      // console.log(universe);
      // console.log(difference(set1, universe));
      if (difference(set1, universe).size > 0) {
        throw new BadRequestError("There is at least one inappropriate filter term in the query.");
      }

      // BadRequestError if there is any inappropriate filter term value
      // console.log(typeof queryString["hasEquity"]);

      const titleInKeys =  keys.includes("title");
      const minSalaryInKeys = keys.includes("minSalary");
      const hasEquityInKeys = keys.includes("hasEquity");
      const titleValueIsString = typeof queryString["title"] !== "string";
      const minSalaryValueIsNumber = typeof queryString["minSalary"] !== "number";
      const hasEquityValueIsBoolean = typeof queryString["hasEquity"] !== "boolean";

      // console.log(
      //   titleInKeys, 
      //   minSalaryInKeys,
      //   hasEquityInKeys,
      //   titleValueIsString, 
      //   minSalaryValueIsNumber, 
      //   hasEquityValueIsBoolean
      // );

      const condition1 = titleInKeys && titleValueIsString;
      const condition2 = minSalaryInKeys && minSalaryValueIsNumber;
      const condition3 = hasEquityInKeys && hasEquityValueIsBoolean;

      // console.log(condition1, condition2, condition3);
      if (condition1 || condition2 || condition3) {
        throw new BadRequestError("There is at least one inappropriate filter term value in the query.");
      }

      // Build the SQL query
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] === "title") {
          querySql += ` ${arr[i]} LOWER(title) LIKE LOWER($${i+1})`;
        }
        if (keys[i] === "minSalary") {
          querySql += ` ${arr[i]} salary >= $${i+1}`;
        }
        if (keys[i] === "hasEquity" && queryString[keys[i]] === true) {
          querySql += ` ${arr[i]} equity > 0`;
        }
      }

      querySql += ` ORDER BY id`;
      // console.log(querySql);
      // console.log(Object.values(queryString));
      const valArr = Object.entries(queryString)
          .map(ent => ent[0] === "title" ? `%${ent[1]}%` : ent[1])
          .filter(el => el !== true);
      // console.log(valArr);
      // console.log(querySql);
      const jobsRes = await db.query(querySql, valArr);
      return jobsRes.rows;
    }
  }

  /** Given a job id, return data about job.
   *
   * Returns { id, title, salary, equity, companyHandle }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const jobRes = await db.query(
          `SELECT id,
                  title, 
                  salary, 
                  equity, 
                  company_handle AS "companyHandle" 
            FROM jobs
            WHERE id = $1`,
          [id]);

    const job = jobRes.rows[0];

    // console.log(`job id => ${job.id}`);

    if (!job) throw new NotFoundError(`No job: ${id}`);

    return job;
  }

  /** Update job data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { title, salary, equity }
   *
   * Returns { id, title, salary, equity, companyHandle }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
      data, { companyHandle: "company_handle" }
    );
    const idVarIdx = "$" + (values.length  + 1);

    const querySql = `UPDATE jobs 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                title, 
                                salary, 
                                equity, 
                                company_handle AS "companyHandle"`;
    const result = await db.query(querySql, [...values, id]);
    const job = result.rows[0];
    
    if (!job) throw new NotFoundError(`No job: ${id}`);

    return job;
  }

  /** Delete given job from database; returns undefined.
   * 
   * Throws NotFoundError if company not found.
   */

  static async remove(id) {
    const result = await db.query(
          `DELETE 
           FROM jobs 
           WHERE id = $1 
           RETURNING id`,
        [id]
    );
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);
  }
}


module.exports = Job;