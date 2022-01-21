//const express = require('express');
import express from 'express';
import bodyParser from 'body-parser';
import magic8ballHandler from './magic8ballHandler';
import soulSphereHandler from './soulSphereHandler';

const app = express();
const port = 5150;

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/magic8ball', magic8ballHandler);
app.post('/soulsphere', soulSphereHandler);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
