import { v4 } from "uuid";
import { DynamoDB } from "aws-sdk";

export async function createEmployee(event) {
  try {
    // connection object
    const dynamoDb = new DynamoDB.DocumentClient();

    // employee info
    const { fullname, identifier, position } = JSON.parse(event.body);
    const id = v4();
    const createdAt = new Date();
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
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(newEmployee),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: e.message }),
    };
  }
}
