const { v4 } = require("uuid");
const AWS = require("aws-sdk");

module.exports.createMenu = async (event) => {
  try {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    const { name, position, type } = JSON.parse(event.body);
    const id = v4();
    const createdAt = new Date();
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
      })
      .promise();

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
