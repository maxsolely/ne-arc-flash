require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const calculate = require('./calculate1584');
const { ObjectID } = require('mongodb');
var { mongoose } = require('./db/mongoose');
var { Station } = require('./models/station');
var { ArcCalc1584 } = require('./models/arcCalc1584');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');

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

app.get('/api/current_user', (req, res) => {
  res.send('hello from localhost 8000');
});
// ********************************************************************************************
// *************************************      USERS      **************************************
// ********************************************************************************************

app.post('/api/users', (req, res) => {
  //get the email and password from the body
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);
  user
    .save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then(token => {
      res.header('x-auth', token).send(user);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.get('/api/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/api/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password)
    .then(user => {
      return user.generateAuthToken().then(token => {
        res.header('x-auth', token).send(user);
      });
    })
    .catch(e => {
      res.status(400).send();
    });
});

app.delete('/api/users/me/token', authenticate, (req, res) => {
  req.user
    .removeToken(req.token)
    .then(() => {
      res.status(200).send();
    })
    .catch(e => {
      res.status(400).send();
    });
});

// ********************************************************************************************
// ************************************      STATIONS      ************************************
// ********************************************************************************************

app.post('/api/stations', authenticate, (req, res) => {
  var body = _.pick(req.body, ['name', 'division', 'voltage', 'stationConfig']);
  Station.findOne({ name: body.name, voltage: body.voltage }).then(station => {
    if (!station) {
      var newStation = new Station({ ...body, _creator: req.user._id });
      newStation
        .save()
        .then(station => {
          res.send(station);
        })
        .catch(e => {
          res.status(400).send(e);
        });
    } else {
      res
        .status(400)
        .send(
          'A station with that name and voltage is already in the database'
        );
    }
  });
});

app.get('/api/stations', authenticate, (req, res) => {
  Station.find()
    .then(stations => {
      res.send({ stations });
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.get('/api/stations/:id', authenticate, (req, res) => {
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

app.delete('/api/stations/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Station.findOneAndDelete({
    _id: id
  })
    .then(station => {
      if (!station || !station.stationCalcs) {
        res.status(404).send();
      }

      if (station.stationCalcs.length >= 1) {
        const stationCalculationsProm = station.stationCalcs.map(
          stationCalc => {
            console.log(stationCalc);
            return ArcCalc1584.findByIdAndDelete({
              _id: stationCalc
            }).catch(e => {
              console.log(e);
            });
          }
        );

        const stationCalcs = Promise.all(stationCalculationsProm)
          .then(stationsCalculations => {
            const deletedCalcs = stationsCalculations.map(calculation => {
              if (!calculation) {
                return res.status(404).send();
              } else {
                return calculation;
              }
            });

            return deletedCalcs;
          })
          .catch(e => {
            res.status(400).send();
          });

        res.send({ station });
      } else {
        res.send({ station });
      }
    })
    .catch(e => {
      console.log(e);
    });
});

app.patch('/api/stations/:id', (req, res) => {
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

// ********************************************************************************************
// ********************************      1584 ARC CALCS       *********************************
// ********************************************************************************************

app.post('/api/arccalc1584', authenticate, (req, res) => {
  var bodyCalcParams = _.pick(req.body.calcParams, [
    'sub',
    'sub2',
    'division',
    'faultType',
    'stationConfig',
    'grounded',
    'lineVoltage',
    'faultCurrent',
    'relayOpTime',
    'comment'
  ]);

  // if calcParams is missing a value (which would make at least one of the results NaN), then calculate1584.js will return an empty object
  var results = calculate.calculate1584Results(bodyCalcParams);

  if (Object.keys(results).length === 4) {
    Station.findOne({
      name: bodyCalcParams.sub,
      voltage: bodyCalcParams.lineVoltage
    })
      .then(station => {
        if (!station) {
          return res.status(404).send('substation does not exist in database');
        } else {
          var arcCalc1584 = new ArcCalc1584({
            calcParams: { ...bodyCalcParams },
            results: { ...results }
          });

          arcCalc1584
            .save()
            .then(arcCalc1584 => {
              station.stationCalcs.push(arcCalc1584._id);
              station
                .save()
                .then(res.send(arcCalc1584))
                .catch(e => console.error(e));
            })
            .catch(e => {
              res.status(400).send(e);
            });
        }
      })
      .catch(e => {
        res.status(400).send(e);
      });
  } else {
    res.status(400).send();
  }
});

app.get('/api/arccalc1584', authenticate, (req, res) => {
  ArcCalc1584.find()
    .then(calculations => {
      res.send({ calculations });
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.get('/api/arccalc1584/:id', authenticate, (req, res) => {
  var id = req.params.id;
  //If ID is not valid
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  ArcCalc1584.findOne({ _id: id })
    .then(calculation => {
      if (!calculation) {
        res.status(404).send();
      }
      res.send({ calculation });
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.delete('/api/arccalc1584/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  ArcCalc1584.findOneAndDelete({
    _id: id
  })
    .then(calculation => {
      if (!calculation) {
        return res.status(404).send();
      }
      Station.findOne({
        name: calculation.calcParams.sub,
        voltage: calculation.calcParams.lineVoltage
      }).then(station => {
        //might not need this else-if check if I will delete all calculations if the station is deleted.
        if (!station) {
          return res.status(404).send('substation does not exist in database');
        } else {
          var updatedStationCalcs = station.stationCalcs.filter(
            value => value != id
          );
          Station.findOneAndUpdate(
            { _id: station._id },
            { $set: { stationCalcs: updatedStationCalcs } },
            { new: true }
          ).then(updatedStation => {
            if (!updatedStation) {
              return res.status(400).send();
            }
            res.send({ updatedStation });
          });
        }
      });
    })
    .catch(e => {
      res.status(400), send(e);
    });
});

app.listen(port, () => {
  console.log(`Starting server on ${port}`);
});

module.exports = { app };
