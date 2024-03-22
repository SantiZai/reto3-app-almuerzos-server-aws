const AWS = require("aws-sdk");

AWS.config.update({ region: "sa-east-1" });
const sns = new AWS.SNS();

module.exports.createOrderPushNotification = async (order, token) => {
  const pushNotificationPayload = {
    title: "Nueva orden creada",
    body: `Tu orden #${order.id} ha sido creada exitosamente`,
    data: order,
    to: token,
  };

  const params = {
    Message: JSON.stringify(pushNotificationPayload),
    TopicArn: "arn:aws:sns:sa-east-1:471112943987:create-order",
  };

  try {
    const response = await sns.publish(params).promise();
    console.log("Notificación push enviada correctamente");
    return {
      response,
      order
    };
  } catch (e) {
    console.error("Error al enviar la notificación push:", e);
  }
};
