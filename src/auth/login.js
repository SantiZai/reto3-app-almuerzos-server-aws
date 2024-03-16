const AWS = require("aws-sdk");

module.exports.login = async (event) => {
  try {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    const user = JSON.parse(event.body);

    const existingUsers = await dynamoDb
      .scan({
        TableName: "Employees",
        FilterExpression: "#fullname = :fullname",
        ExpressionAttributeNames: {
          "#fullname": "fullname",
        },
        ExpressionAttributeValues: {
          ":fullname": user.fullname,
        },
      })
      .promise();

    if (String(existingUsers.Items[0].identifier) === String(user.identifier)) {
      return {
        statusCode: 200,
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
