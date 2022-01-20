const answers = require('./answers');
const { randInt } = require('./util');

const handler = (req, res) => {
  try {
    const answer = answers[randInt(0, answers.length - 1)];
    const { body } = req;

    console.log('incoming request', body);

    const { text, user_name } = body;

    const slackResponse = {
      response_type: 'in_channel',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `_${user_name} shakes the magic 8 ball and asks \"${text}\"_`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${answer}`,
          },
        },
      ],
    };

    res.json(slackResponse);
  } catch (e) {
    console.error('an error occurred');
    console.error(e);
    res.status(500).send('error');
  }
};

module.exports = handler;
