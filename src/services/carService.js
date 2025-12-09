const { randomUUID } = require("crypto");
const { carDynamoRepo } = require("../repos/carDynamoRepo");
const { BadRequest, NotFound } = require("../utils/errors");
const { CarStatuses } = require("../models/types");

const allowedStatuses = new Set(CarStatuses);

function validateCreate(input) {
  if (!input || typeof input !== "object") {
    throw new BadRequest("Body must be an object");
  }
  const { make, model, year } = input;
  
  if (!make || typeof make !== "string") {
    throw new BadRequest("make is required")
  }
  
  if (!model || typeof model !== "string") {
    throw new BadRequest("model is required")
  }
  
  const yearNum = Number(year);
  
  if (!Number.isInteger(yearNum) || yearNum < 1886) {
    throw new BadRequest("year is invalid")
  }
  
  return { make, model, year: yearNum };
}

const carService = {
  async create(input) {
    const valid = validateCreate(input);
    const car = { id: randomUUID(), status: "idle", ...valid };
    return carDynamoRepo.create(car);
  },

  async get(id) {
    const car = await carDynamoRepo.get(id);
    if (!car) throw new NotFound("Car not found");
    return car;
  },

  list() {
    return carDynamoRepo.list();
  },

  async updateStatus(id, status) {
    if (!allowedStatuses.has(status)) throw new BadRequest("Invalid status");
    const updated = await carDynamoRepo.updateStatus(id, status);
    if (!updated) throw new NotFound("Car not found");
    return updated;
  },
};

module.exports = { carService };
