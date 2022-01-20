const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

// sourced from https://en.wikipedia.org/wiki/Magic_8-ball
const answers = [
  "It is certain.",
  "It is decidedly so.",
  "Without a doubt.",
  "Yes definitely.",
  "You may rely on it.",

  "As I see it, yes.",
  "Most likely.",
  "Outlook good.",
  "Yes.",
  "Signs point to yes.",

  "Reply hazy, try again.",
  "Ask again later.",
  "Better not tell you now.",
  "Cannot predict now.",
  "Concentrate and ask again.",

  "Don't count on it.",
  "My reply is no.",
  "My sources say no.",
  "Outlook not so good.",
  "Very doubtful. ",
];

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

app.post("/magic8ball", (req, res) => {
  console.log("req.body", req.body);

  const answer = answers[getRandomIntInclusive(0, answers.length - 1)];
  const text = `${req.body.user_name} ${answer}`;

  const slackResponse = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${req.body.user_name} shakes the magic 8 ball and asks`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${answer}*`,
        },
      },
    ],
  };

  res.json(slackResponse);

  // res.json({
  //   response_type: "in_channel",
  //   text,
  // });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
