require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const { ObjectID } = require('mongodb');
var { mongoose } = require('./db/mongoose');
var { Station } = require('./models/station');
var { ArcCalc } = require('./models/arcCalc');

var port = process.env.PORT;
var app = express();
app.use(bodyParser.json());

// **********************************************
// ****************** STATIONS ******************
// **********************************************

app.post('/stations', (req, res) => {
  var body = _.pick(req.body, ['name', 'division', 'voltage', 'stationType']);
  var station = new Station({ ...body });

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

app.get('/stations/:id', (req, res) => {
  var id = req.params.id;
  //If ID is not valid
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Station.findOne({ _id: id })
    .then(station => {
      if (!station) {
        res.status(404).send();
      }
      res.send({ station });
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.delete('/stations/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Station.findOneAndDelete({
    _id: id
  })
    .then(station => {
      if (!station) {
        res.status(404).send();
      }
      res.send({ station });
    })
    .catch(e => {
      res.status(400).send();
    });
});

// **********************************************
// ***************** ARC CALCS ******************
// **********************************************

app.post('/arccalc', (req, res) => {
  var bodyCalcParams = _.pick(req.body.calcParams, [
    'sub1',
    'sub2',
    'faultCurrent',
    'relayOpTime',
    'lineVoltage',
    'lineNumber',
    'faultType',
    'stationType',
    'grounded'
  ]);
  var bodyArcCaseInput = _.pick(req.body.arcCaseInput, [
    'current',
    'sourceVoltage',
    'duration',
    'electrodeMaterial',
    'distanceToArc'
  ]);
  var bodyResults = _.pick(req.body.results, [
    'arcVoltage',
    'arcEnergy',
    'incidentEnergy',
    'hrcLevel'
  ]);

  Station.findOne({ name: bodyCalcParams.sub1 })
    .then(station => {
      console.log(station);
      var arcCalc = new ArcCalc({
        calcParams: { ...bodyCalcParams },
        arcCaseInput: { ...bodyArcCaseInput },
        results: { ...bodyResults }
      });

      arcCalc
        .save()
        .then(arcCalc => {
          station.stationCalcs.push(arcCalc);
          station
            .save()
            .then(res.send(arcCalc))
            .catch(e => console.error(e));
        })
        .catch(e => {
          console.log(e);
          res.status(400).send(e);
        });
    })
    .catch(e => {
      console.log(e);
      res.status(400).send(e);
      a;
    });
});

app.listen(port, () => {
  console.log(`Starting server on ${port}`);
});

module.exports = { app };
