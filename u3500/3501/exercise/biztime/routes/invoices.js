/** Routes for invoices of biztime */

const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");

router.get('/', async (req, res, next) => {
  try {
    const results = await db.query(
      "SELECT * FROM invoices"
    );
    const arr = results.rows.map(v => {
      return { id: v.id, comp_code: v.comp_code }
    });
    return res.json({ invoices: arr });
  } catch (e) {
    return next(e)
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const results = await db.query(
      "SELECT * FROM invoices WHERE id=$1", [id]
    );
    if (results.rows.length === 0) {
      throw new ExpressError(`No invoice with id '${id}'`, 404);
    }
    const obj = results.rows[0];
    const { comp_code } = obj;
    delete obj.comp_code;
    const results2 = await db.query(
      "SELECT * FROM companies WHERE code=$1", [comp_code]
    );
    if (results2.rows.length === 0) {
      throw new ExpressError(`No company with code '${comp_code}'`, 404);
    }
    obj.company = results2.rows[0];
    return res.send({ invoice: obj });
  } catch (e) {
    return next(e)
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { comp_code, amt } = req.body;
    const results = await db.query(
      "INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *", [comp_code, amt]
    );
    return res.status(201).json({ invoice: results.rows[0] })
  } catch (e) {
    return next(e)
  }
});

// VERY DIFFERENT IN SOLUTION
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amt } = req.body;
    const results = await db.query(
      "UPDATE invoices SET amt=$1 WHERE id=$2 RETURNING *", [amt, id]
    );
    if (results.rows.length === 0) {
      throw new ExpressError(`No invoice with id '${id}'`, 404);
    }

    // return res.send({ invoice: results.rows[0] })
    return res.json({ invoice: results.rows[0] })  // in solution

  } catch (e) {
    return next(e)
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const results = await db.query(
      "SELECT * FROM invoices WHERE id=$1", [id]
    );
    if (results.rows.length === 0) {
      throw new ExpressError(`No invoice with id '${id}'`, 404);
    }
    await db.query(
      "DELETE FROM invoices WHERE id=$1", [id]
    );

    // return res.send({ status: "deleted" });
    return res.json({ status: "deleted" });  // in solution

  } catch (e) {
    return next(e)
  }
});


module.exports = router;