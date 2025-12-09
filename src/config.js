const dotenv = require("dotenv");

// Load environment variables for local development; in production provide env vars directly.
dotenv.config();

const config = {
  port: Number(process.env.PORT) || 3000,
  awsRegion: process.env.AWS_REGION || "us-east-1",
  dynamoEndpoint: process.env.DYNAMO_ENDPOINT, // e.g., http://dynamodb:8000 for local
  carTable: process.env.CAR_TABLE || "cars",
};

module.exports = { config };
