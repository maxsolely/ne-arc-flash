require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const calculate = require('./calculate1584');
const { ObjectID } = require('mongodb');
var { mongoose } = require('./db/mongoose');
var { Station } = require('./models/station');
//var { ArcCalc } = require('./models/arcCalc');
var { ArcCalc1584 } = require('./models/arcCalc1584');

var port = process.env.PORT;
var app = express();
app.use(bodyParser.json());

//global vars
const divisionEnums = [
  'Bay State West',
  'North and Granite',
  'Bay State South',
  'Ocean State'
];

const stationConfigEnums = ['Metalclad', 'Open-Air'];

function createCleanObject(obj) {
  var clonedObject = _.cloneDeep(obj);
  for (var propName in clonedObject) {
    var objectValue = _.trim(clonedObject[propName]);
    if (objectValue === null || objectValue.length === 0) {
      delete clonedObject[propName];
    }
  }
  return clonedObject;
}

// **********************************************
// ****************** STATIONS ******************
// **********************************************

app.post('/stations', (req, res) => {
  var body = _.pick(req.body, ['name', 'division', 'voltage', 'stationConfig']);
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

app.patch('/stations/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  var bodyToUpdate = _.pick(req.body, [
    'name',
    'division',
    'voltage',
    'stationConfig'
  ]);

  var cleanBody = createCleanObject(bodyToUpdate);

  // if the body is empty
  if (Object.keys(cleanBody || {}).length === 0) {
    return res.status(400).send();
  }

  // if bodyToUpdate has a division key and it is not a valid option
  if (
    cleanBody.hasOwnProperty('division') &&
    divisionEnums.indexOf(cleanBody.division) < 0
  ) {
    return res.status(400).send('invalid division');
  }

  // if the stationConfig is not correct
  if (
    cleanBody.hasOwnProperty('stationConfig') &&
    stationConfigEnums.indexOf(cleanBody.stationConfig) < 0
  ) {
    return res.status(400).send('invalid station configuration');
  }

  //   // if bodyToUpdate has a name property
  // if (cleanBody.hasOwnProperty('name')) {
  //   Station.findOne({name: cleanBody.name}).then(station => {

  //   })
  // }

  Station.findOneAndUpdate({ _id: id }, { $set: cleanBody }, { new: true })
    .then(station => {
      if (!station) {
        return res.status(404).send();
      }
      res.send({ station });
    })
    .catch(e => {
      res.status(400).send(e);
    });
});
// **********************************************
// ***************** ARC CALCS ******************
// **********************************************

app.post('/arccalc1584', (req, res) => {
  var bodyCalcParams = _.pick(req.body.calcParams, [
    'sub',
    'division',
    'faultType',
    'stationConfig',
    'grounded',
    'lineVoltage',
    'faultCurrent',
    'relayOpTime'
  ]);

  var results = calculate.calculated1584Results(bodyCalcParams);

  Station.findOne({ name: bodyCalcParams.sub })
    .then(station => {
      var arcCalc1584 = new ArcCalc1584({
        calcParams: { ...bodyCalcParams },
        results: { ...results }
      });

      arcCalc1584
        .save()
        .then(arcCalc1584 => {
          station.stationCalcs.push(arcCalc1584);
          station
            .save()
            .then(res.send(arcCalc1584))
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
    });
});

app.listen(port, () => {
  console.log(`Starting server on ${port}`);
});

module.exports = { app };
