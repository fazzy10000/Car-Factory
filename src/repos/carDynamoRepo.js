const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");
const { config } = require("../config");

// Reusable DynamoDB document client; endpoint is optional (used for local DynamoDB).
const client = new DynamoDBClient({
  region: config.awsRegion,
  endpoint: config.dynamoEndpoint,
});

const doc = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

const carDynamoRepo = {
  async create(car) {
    await doc.send(
      new PutCommand({
        TableName: config.carTable,
        Item: car,
        ConditionExpression: "attribute_not_exists(id)", // avoid overwrite
      }),
    );
    return car;
  },

  async get(id) {
    const res = await doc.send(
      new GetCommand({
        TableName: config.carTable,
        Key: { id },
      }),
    );
    return res.Item;
  },

  async list() {
    const res = await doc.send(
      new ScanCommand({
        TableName: config.carTable,
      }),
    );
    return res.Items ?? [];
  },

  async updateStatus(id, status) {
    const res = await doc.send(
      new UpdateCommand({
        TableName: config.carTable,
        Key: { id },
        UpdateExpression: "SET #s = :s",
        ExpressionAttributeNames: { "#s": "status" },
        ExpressionAttributeValues: { ":s": status },
        ReturnValues: "ALL_NEW",
      }),
    );
    return res.Attributes;
  },
};

module.exports = { carDynamoRepo };
