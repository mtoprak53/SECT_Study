/** Routes for companies of biztime */

const express = require("express");
const ExpressError = require("../expressError");
const slugify = require("slugify");

const router = express.Router();
// let router = new express.Router();  // in solution

const db = require("../db");

router.get('/', async (req, res, next) => {
  try {
    const results = await db.query(
      `SELECT * FROM companies`
    );
    return res.json({ companies: results.rows });
  } catch (e) {
    return next(e)
  }
});

router.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const comRes = await db.query(
      "SELECT * FROM companies WHERE code=$1", [code]
    );
    const invRes = await db.query(
      "SELECT * FROM invoices WHERE comp_code=$1", [code]
    );
    if (comRes.rows.length === 0) {
      throw new ExpressError(`No company with code ${code}`, 404);
    }
    const company = comRes.rows[0];
    company.invoices = invRes.rows;
    return res.json({ company })
  } catch (e) {
    return next(e)
  }
});

router.post('/', async (req, res, next) => {
  try {
    // const { code, name, description } = req.body;
    const { name, description } = req.body;
    let code = slugify(name, { lower: true });
    const results = await db.query(
      `INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *`, [code, name, description]
    );
    return res.status(201).json({ company: results.rows[0] });
  } catch (e) {
    return next(e)
  }
});

router.put('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const { name, description } = req.body;
    const results = await db.query(
      `UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING *`, [name, description, code]
    );
    if (results.rows.length === 0) {
      throw new ExpressError(`No company with code ${code}`, 404);
    }
    // return res.send({ company: results.rows[0] })
    return res.json({ company: results.rows[0] })  // in solution
  } catch (e) {
    return next(e)
  }
});

router.delete('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const results = await db.query(
      "SELECT * FROM companies WHERE code=$1", [code]
    );
    if (results.rows.length === 0) {
       throw new ExpressError(`No company with code ${code}`, 404);
    }
    await db.query(
      "DELETE FROM companies WHERE code=$1", [code]
    );
    return res.send({ status: "deleted" })
  } catch(e) {
    return next(e)
  }
});


module.exports = router;