const { v4 } = require("uuid");

const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");

const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { createOrderPushNotification } = require("../../sns/push/android");
const { createOrderEmailNotification } = require("../../sns/email");

module.exports.createOrder = async (event) => {
  try {
    const dynamoDb = DynamoDBDocument.from(new DynamoDB());

    const parsedBody = JSON.parse(event.body);
    const id = v4();
    const date = new Date();
    const createdAt = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    const newOrder = {
      id,
      createdAt,
      employeeid: parsedBody.order.employeeid,
      menus: parsedBody.order.menus,
    };

    await dynamoDb.put({
      TableName: "Orders",
      Item: newOrder,
    });

    if (parsedBody.token) {
      await createOrderPushNotification(newOrder, parsedBody.token);
    } else {
      const { to, from, subject, text } = parsedBody;
      await createOrderEmailNotification({ to, from, subject, text });
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Orden creada exitosamente",
        order: newOrder,
      }),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: e.message }),
    };
  }
};
