const { v4 } = require("uuid");

const {
  DynamoDBDocument,
} = require("@aws-sdk/lib-dynamodb");

const {
  DynamoDB,
} = require("@aws-sdk/client-dynamodb");

module.exports.register = async (event) => {
  try {
    const dynamoDb = DynamoDBDocument.from(new DynamoDB());

    const { fullname, identifier, position } = JSON.parse(event.body);
    const id = v4();
    const date = new Date
    const createdAt = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
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
      });

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
