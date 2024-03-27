const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");

const { DynamoDB } = require("@aws-sdk/client-dynamodb");

module.exports.login = async (event) => {
  try {
    const dynamoDb = DynamoDBDocument.from(new DynamoDB());

    const user = JSON.parse(event.body);

    const existingUsers = await dynamoDb.scan({
      TableName: "Employees",
      FilterExpression: "#fullname = :fullname",
      ExpressionAttributeNames: {
        "#fullname": "fullname",
      },
      ExpressionAttributeValues: {
        ":fullname": user.fullname,
      },
    });

    if (String(existingUsers.Items[0].identifier) === String(user.identifier)) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(existingUsers.Items[0]),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid credentials" }),
      };
    }
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: e.message }),
    };
  }
};
