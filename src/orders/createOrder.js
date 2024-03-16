const { v4 } = require("uuid");
const AWS = require("aws-sdk");

module.exports.createOrder = async (event) => {
  try {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    const { employeeid, menus } = JSON.parse(event.body);
    const id = v4();
    const createdAt = new Date();
    const newOrder = {
      id,
      createdAt,
      employeeid,
      menus,
    };

    await dynamoDb
      .put({
        TableName: "Orders",
        Item: newOrder,
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(newOrder),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: e.message }),
    };
  }
};
