const express = require("express");
const { carService } = require("../services/carService");

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const cars = await carService.list();
    res.json(cars);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const car = await carService.create(req.body);
    res.status(201).json(car);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const car = await carService.get(req.params.id);
    res.json(car);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/status", async (req, res, next) => {
  try {
    const updated = await carService.updateStatus(req.params.id, req.body.status);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
