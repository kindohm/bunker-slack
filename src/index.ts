import express from 'express';
import bodyParser from 'body-parser';
import magic8ball from './routes/magic8ball';
import soulSphere from './routes/soulSphere';

const app = express();
const port = 5150;

app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use('/magic8ball', magic8ball);
app.use('/soulsphere', soulSphere);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
