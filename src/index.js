const express = require('express');
const app = express();
const port = 5150;
const bodyParser = require('body-parser');
const magic8ballHandler = require('./magic8ballHandler');
const soulSphereHandler = require('./soulSphereHandler');

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/magic8ball', magic8ballHandler);
app.post('/soulsphere', soulSphereHandler);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
