const AWS = require("aws-sdk");

AWS.config.update({ region: "sa-east-1" });
const ses = new AWS.SES();

module.exports.createOrderEmailNotification = async (data) => {
  const { to, from, subject, text } = data;

  if (!to || !from || !subject || !text)
    return {
      status: 400,
      message: "to, from, subject and text are all required in the body!",
    };

  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: { Text: { Data: text } },
      Subject: { Data: subject },
    },
    Source: from,
  };

  try {
    await ses.sendEmail(params).promise();
    return { status: 200, message: "Notificación enviada!" };
  } catch (e) {
    console.error("Ha ocurrido un error.", e);
  }
};
