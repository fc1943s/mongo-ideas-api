const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./auth');
const routes = require('./routes');
const db = require('./db');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(auth.initialize());

app.use(routes);

const PORT = 5000;
app.listen(PORT, async () => {
  console.log(`Listening on ${PORT}`);

  await db.seedData();
});
