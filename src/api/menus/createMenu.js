const { v4 } = require("uuid");

const {
  DynamoDBDocument,
} = require("@aws-sdk/lib-dynamodb");

const {
  DynamoDB,
} = require("@aws-sdk/client-dynamodb");

module.exports.createMenu = async (event) => {
  try {
    const dynamoDb = DynamoDBDocument.from(new DynamoDB());

    const { name, position, type } = JSON.parse(event.body);
    const id = v4();
    const date = new Date
    const createdAt = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    const newMenu = {
      id,
      createdAt,
      name: name.toLowerCase(),
      position: position.toLowerCase(),
      type: type.toLowerCase(),
    };

    await dynamoDb
      .put({
        TableName: "Menus",
        Item: newMenu,
      });

    return {
      statusCode: 200,
      body: JSON.stringify(newMenu),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: e.message }),
    };
  }
};
