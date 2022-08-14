const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const config = require('./config.json');

const app = express();

app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));

app.get('/', routes.initial);
app.get('/notion', routes.notionRead);
app.get('/notionCreate', routes.notionCreate);


app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
  });
  
  module.exports = app;