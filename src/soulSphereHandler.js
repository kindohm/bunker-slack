const tracery = require('tracery-grammar');
const { randInt } = require('./util');
const structures = require('./structures');

const getRandomSentence = async () => {
  const grammar = tracery.createGrammar(
    structures[randInt(0, structures.length - 1)]
  );
  grammar.addModifiers(tracery.baseEngModifiers);
  return grammar.flatten('#origin#');
};

const handler = async (req, res) => {
  try {
    const { body } = req;
    const { user_name } = body;
    const sentence = await getRandomSentence();

    const slackResponse = {
      response_type: 'in_channel',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `_${user_name} shakes the Soul Sphere_`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: sentence,
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
