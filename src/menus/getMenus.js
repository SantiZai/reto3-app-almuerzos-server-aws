const AWS = require("aws-sdk");

module.exports.getMenus = async (event) => {
  try {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    const queryPosition = event.pathParameters.position;

    const menus = await dynamoDb
      .scan({
        TableName: "Menus",
        FilterExpression: "#pos = :position",
        ExpressionAttributeNames: {
          "#pos": "position", // alias para el atributo "position"
        },
        ExpressionAttributeValues: {
          ":position": queryPosition.toLowerCase(),
        },
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(menus.Items),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: e.message }),
    };
  }
};
