/** Routes for demonstrating authentication in Express */

const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config");
const { register, authenticate, updateLoginTimestamp } = require("../models/user");


/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // IF THEY ARE ABSENT
    if (!username || !password) {
      throw new ExpressError(`Username and password required!`, 400);
    }

    // IF EVERYTHING IS FINE
    if (await authenticate(username, password)) {
      await updateLoginTimestamp(username);
      const token = jwt.sign({ username }, SECRET_KEY);
      return res.json({ token });
    }
    
    // IF THEY ARE WRONG
    throw new ExpressError("Invalid username/password", 400);

  } catch (e) {
    return next(e);
  }
});


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post('/register', async (req, res, next) => {
  try {
    const { username, password, first_name, last_name, phone } = req.body;

    // IF THEY ARE ABSENT
    if (!username || !password) {
      throw new ExpressError(`Username and password required!`, 400);
    }

    const user = await register({ username, password, first_name, last_name, phone });

    await updateLoginTimestamp(username);
    const token = jwt.sign({ username }, SECRET_KEY);
    return res.json({ token });
    
  } catch (e) {
    if (e.code === '23505') {
      return next(new ExpressError("Username taken. Please pick another!", 400));
    }
    return next(e);
  }
});


 module.exports = router;