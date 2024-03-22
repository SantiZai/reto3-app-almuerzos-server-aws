const AWS = require("aws-sdk");

AWS.config.update({ region: "sa-east-1" });
const sns = new AWS.SNS();

module.exports.createOrderPushNotification = async (order) => {
  const pushNotificationPayload = {
    title: "Nueva orden creada",
    body: "Tu orden ha sido creada satisfactoriamente",
    data: {
      createdAt: new Date(),
      order : {
        menu: order.menus
      }
    },
  };

  const params = {
    Message: JSON.stringify(pushNotificationPayload),
    TopicArn: "arn:aws:sns:sa-east-1:471112943987:create-order",
  };

  try {
    await sns.publish(params).promise();
    console.log();
  } catch (e) {
    console.error(e);
  }
};
