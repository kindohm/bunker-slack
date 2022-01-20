const express = require("express");
const app = express();
const port = 5150;
const bodyParser = require("body-parser");
const answers = require('./answers')

app.use(bodyParser.urlencoded({ extended: true }));

const randInt = (min, max) => {
  const cmin = Math.ceil(min);
  const fmax = Math.floor(max);
  return Math.floor(Math.random() * (fmax - cmin + 1) + cmin);
};

app.post("/", (req, res) => {
  try {
    const answer = answers[randInt(0, answers.length - 1)];
    const { body } = req;
    const { text, user_name } = body;

    const slackResponse = {
      response_type: "in_channel",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `_${user_name} shakes the magic 8 ball and asks \"${text}\"_`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${answer}`,
          },
        },
      ],
    };

    res.json(slackResponse);
  } catch (e) {
    console.error("an error occurred");
    console.error(e);
    res.status(500).send("error");
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
