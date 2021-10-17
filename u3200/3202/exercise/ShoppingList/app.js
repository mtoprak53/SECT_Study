const express = require('express');
const app = express();
const itemsRoutes = require('./routes/items');
const ExpressError = require('./expressError');

app.use(express.json());
app.use('/items', itemsRoutes);

// 404 HANDLER
app.use((req, res) => {
  return new ExpressError("Page Not Found", 404);
});

// GENERIC ERROR HANDLER
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  return res.json({
    error: err.message
  });
});

module.exports = app;