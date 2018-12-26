require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose');
var { Station } = require('./models/station');

var port = process.env.PORT;
var app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send({
    text: 'hello from the arc flash calc'
  });
});

app.post('/addNewStation', (req, res) => {
  var body = _.pick(req.body, ['name', 'division', 'voltage', 'stationType']);
  var station = new Station({
    name: body.name,
    division: body.division,
    voltage: body.voltage,
    stationType: body.stationType
  });

  station
    .save()
    .then(station => {
      res.send(station);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.get('/stations', (req, res) => {
  Station.find()
    .then(stations => {
      res.send({ stations });
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.listen(port, () => {
  console.log(`Starting server on ${port}`);
});
