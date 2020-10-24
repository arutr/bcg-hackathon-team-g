import { Handler } from "aws-lambda";
import DynamoDbConnector from "./src/ddbConnector";
import { FormQuestion } from "./src/model/formQuestion";
import Questions from "./src/questions";

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
  return await botLogic(event);
};

const botLogic = async (event) => {
  const formQuestions = new Questions().questions;
  const userInput = event.inputTranscript;
  const tableName = "conversation-dev";
  const dbConnector = new DynamoDbConnector(tableName);
  const userId =
    (event.userId as string).indexOf(":") > -1
      ? event.userId.split(":")[2]
      : event.userId;

  let currIndexAnswer = await dbConnector.getCurrentAnswer(userId);
  const currQuestion: FormQuestion = formQuestions[currIndexAnswer];
  const finalWords = "You are done! Thank you for the responses.";
  if (currIndexAnswer >= formQuestions.length) {
    return getAnswer(finalWords);
  }

  let finalAnswer = "";
  if (currIndexAnswer === 0) {
    await dbConnector.createForm(userId);
    const welcomeWords = `Hello! You are talking with matchmaking bot. I will help you to best possible partner for coffee breaks. I am going to send you images. Please type y if you like the image and n if you do not like it\n${currQuestion.link}`;
    finalAnswer = welcomeWords;
  } else {
    finalAnswer = currQuestion.link;
  }
  await dbConnector.updateAnswer(userId, currIndexAnswer, userInput);
  return getAnswer(finalAnswer);
};

const getAnswer = (content: string) => {
  return {
    dialogAction: {
      type: "Close",
      fulfillmentState: "Fulfilled",
      message: {
        contentType: "PlainText",
        content,
      },
    },
  };
};
