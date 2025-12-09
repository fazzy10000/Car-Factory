const express = require("express");
const cars = require("./routes/cars");
const { config } = require("./config");
const { BadRequest, NotFound } = require("./utils/errors");

const app = express();
app.use(express.json());
app.use("/cars", cars);

// Error handler
app.use((err, _req, res, _next) => {
  if (err instanceof BadRequest) return res.status(400).json({ message: err.message });
  if (err instanceof NotFound) return res.status(404).json({ message: err.message });
  console.error(err);
  res.status(500).json({ message: "Internal error" });
});

if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`car-factory listening on port ${config.port}`);
  });
}

module.exports = { app };
