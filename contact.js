const aws = require("aws-sdk");
const ses = new aws.SES();
const contactEmail = process.env.DEST_EMAIL;
const senderEmail = process.env.SENDER_EMAIL;
const contactDomain = process.env.DOMAIN;

function generateResponse(code, payload) {
  return {
    statusCode: code,
    headers: {
      "Access-Control-Allow-Origin": contactDomain,
      "Access-Control-Allow-Headers": "x-requested-with",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(payload)
  }
}

function generateError(code, err) {
  console.log(err);
  return {
    statusCode: code,
    headers: {
      "Access-Control-Allow-Origin": contactDomain,
      "Access-Control-Allow-Headers": "x-requested-with",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(err.message)
  }
}

const htmlTemplate = (data) => {
  return `
  <p><strong>Name:</strong> ${data.name}</p>
  <p><strong>Email:</strong> ${data.email}</p>
  <p><strong>Message:</strong> ${data.content}</p>
  `;
};

function generateEmailParams(body) {
  const { email, name, subject, content } = JSON.parse(body);
  console.log(email, name, content, subject);
  if (!(email && name && content && subject)) {
    throw new Error("Missing parameters! Make sure to add parameters \'email\', \'name\', \'content\'.");
  }

  const message = {
    name,
    email,
    content
  };

  return {
    Source: senderEmail,
    Destination: { ToAddresses: [contactEmail]},
    ReplyToAddresses: [senderEmail],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlTemplate(message)
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: `COMS webform: ${subject}!`
      }
    }
  }
}

module.exports.send = async (event) => {
  try {
    const emailParams = generateEmailParams(event.body);
    const data = await ses.sendEmail(emailParams).promise();
    return generateResponse(200, data);
  } catch (err) {
    return generateError(500, err);
  }
}
