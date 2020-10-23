import { Handler } from "aws-lambda";

export const match: Handler = async (event: any) => {
  console.log(event);
  const response = {
    statusCode: 200,
    body: JSON.stringify(
      {
        response_type: "ephemeral",
        text: "I will match you soon...",
      },
      null,
      2
    ),
  };

  return response;
};

export const answer: Handler = async (event: any) => {
  console.log(event);
  let lambda_response = {
    dialogAction: {
      type: "Close",
      fulfillmentState: "Fulfilled",
      message: {
        contentType: "PlainText",
        content: "https://media.giphy.com/media/Ov5NiLVXT8JEc/giphy.gif",
      },
    },
  };
  return lambda_response;
};
