const {
  DynamoDBDocument,
} = require("@aws-sdk/lib-dynamodb");

const {
  DynamoDB,
} = require("@aws-sdk/client-dynamodb");

module.exports.getMenus = async (event) => {
  try {
    const dynamoDb = DynamoDBDocument.from(new DynamoDB());

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
      });

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
