const SES = require("@aws-sdk/client-ses");
const sesClient = new SES.SESClient({ region: "sa-east-1" });

AWS.config.update({ region: "sa-east-1" });
const ses = new AWS.SES();

module.exports.createEmailNotification = (toEmail) => {
  try {
    return new SES.SendEmailCommand({
      Destination: {
        ToAddresses: [toEmail],
      },
      Message: {
        Body: {
          Text: "Nueva orden creada",
        },
      },
      Source: "santiagozaidandev@gmail.com",
    });
  } catch (e) {
    console.error("Error al enviar el email:", e);
  }
};
