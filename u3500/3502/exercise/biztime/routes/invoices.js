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
    const invRes = await db.query(
      "SELECT * FROM invoices WHERE id=$1", [id]
    );
    if (invRes.rows.length === 0) {
      throw new ExpressError(`No invoice with id '${id}'`, 404);
    }
    const invoice = invRes.rows[0];
    const { comp_code } = invoice;
    const comRes = await db.query(
      "SELECT * FROM companies WHERE code=$1", [comp_code]
    );
    invoice.company = comRes.rows[0];
    return res.json({ invoice });
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
    const { amt, paid } = req.body;
    const results = await db.query(
      "UPDATE invoices SET amt=$1 WHERE id=$2 RETURNING *", [amt, id]
    );
    if (results.rows.length === 0) {
      throw new ExpressError(`No invoice with id '${id}'`, 404);
    }
    let newRes = results;
    const invoice = results.rows[0];
    if (invoice.paid_date === null) {
      if (paid) {

        // PAID_DATE: null | paying
        newRes = await db.query(
          `UPDATE invoices 
          SET paid_date=CURRENT_DATE, paid=true
          WHERE id=$1 
          RETURNING id, comp_code, amt, paid, add_date, paid_date`, [id]
        );
      }
    } else {
      if (!paid) {

        // PAID_DATE: SOME DATE | unpaying
        newRes = await db.query(
          `UPDATE invoices 
          SET paid_date=null, paid=false
          WHERE id=$1 
          RETURNING id, comp_code, amt, paid, add_date, paid_date`, [id]
        );
      }
    }
    return res.json({ invoice: newRes.rows[0] })
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