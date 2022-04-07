"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate, 
        sqlForGetAllJobs } = require("../helpers/sql");
// const { difference } = require("../helpers/difference");

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
      return jobsRes.rows;
    }

    // WITH FILTER
    else {
      const [querySql_, valArr] = sqlForGetAllJobs(queryString);
      querySql += querySql_;
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

  /** Given a companyHandle, return data about jobs at this company.
   *
   * Returns { id, title, salary, equity }
   *
   * Throws NotFoundError if not found.
   **/

  static async getHandle(handle) {
    const jobRes = await db.query(
          `SELECT id,
                  title, 
                  salary, 
                  equity 
            FROM jobs
            WHERE company_handle = $1`,
          [handle]);
    const jobs = jobRes.rows;

    return jobs;
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