const { v4 } = require("uuid");

const {
  DynamoDBDocument,
} = require("@aws-sdk/lib-dynamodb");

const {
  DynamoDB,
} = require("@aws-sdk/client-dynamodb");
const { createOrderPushNotification } = require("../../sns/push/android");

module.exports.createOrder = async (event) => {
  try {
    const dynamoDb = DynamoDBDocument.from(new DynamoDB());

    const { employeeid, menus } = JSON.parse(event.body);
    const id = v4();
    const date = new Date
    const createdAt = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
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
      });

    await createOrderPushNotification(newOrder)

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
