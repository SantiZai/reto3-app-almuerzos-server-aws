const { v4 } = require("uuid");
const AWS = require("aws-sdk");

module.exports.register = async (event) => {
  try {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    const { fullname, identifier, position } = JSON.parse(event.body);
    const id = v4();
    const createdAt = new Date();
    const newEmployee = {
      id,
      createdAt,
      fullname: fullname.toLowerCase(),
      identifier: String(identifier),
      position: position.toLowerCase(),
    };

    await dynamoDb
      .put({
        TableName: "Employees",
        Item: newEmployee,
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify(newEmployee),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: e.message }),
    };
  }
};