// #####################################
// STARTERS

const express = require('express');
const ExpressError = require('./expressError');
const { mean, median, mode } = require("./funcs");
const app = express();

// GLOBAL VARIABLES (to reach in any route)
let numsArr, operation, value;

// ROUTE INDEPENDENT CALCULATIONS
app.use((req, res, next) => {
  const { nums } = req.query;
  if (nums === '') {
    throw new ExpressError("nums are required!", 400);
  }
  numsArr = nums.split(',');
  numsArr.forEach((v, i, arr) => {
    if (isNaN(v)) {
      throw new ExpressError(`${v} is not a number!!`, 400)
    }
    arr[i] = parseInt(v);
  });
  next();
});


// #####################################
// ROUTES

app.get("/mean", (req, res, next) => {
  try {
    operation = "mean";
    value = mean(numsArr);
    return res.json({
      "response": { operation, value }
    });
  } catch (e) {
    next(e);
  }
});

app.get("/median", (req, res, next) => {
  try {
    operation = "median";    
    value = median(numsArr);
    return res.json({
      "response": { operation, value }
    })
  } catch (e) {
    next(e);
  }
});

app.get("/mode", (req, res, next) => {
  try {
    operation = "mode";
    value = mode(numsArr);
    return res.json({
      "response": { operation, value }
    })
  } catch (e) {
    next(e);
  }
});


// #####################################
// IN THE END STUFF

app.use((req, res, next) => {
  const e = new ExpressError("Page Not Found", 404);
  return next(e);
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.msg;
  return res.status(status).json({
    error: { message, status }
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});