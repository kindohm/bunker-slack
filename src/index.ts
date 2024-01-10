import express from 'express';
import bodyParser from 'body-parser';
import magic8ball from './routes/magic8ball';
import soulSphere from './routes/soulSphere';
import hangman from './routes/hangman';
import oob from './routes/oob';
import talker from './routes/talker';
import d20 from './routes/d20';
import neil from './routes/neil';
import interact from './routes/interact';

const app = express();
const port = 5150;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use('/interact', interact);
app.use('/magic8ball', magic8ball);
app.use('/soulsphere', soulSphere);
app.use('/hangman', hangman);
app.use('/oob', oob);
app.use('/d20', d20);
app.use('/neil', neil);
app.use('/neildegrassetysonfact', neil);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
