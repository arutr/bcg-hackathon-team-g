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
