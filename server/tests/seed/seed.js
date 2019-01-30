const { ObjectID } = require('mongodb');

const { Station } = require('./../../models/station');

const stations = [
  {
    _id: new ObjectID(),
    name: 'Test Station',
    division: 'Bay State West',
    voltage: '13.8 kV',
    stationConfig: 'Metalclad'
  },
  {
    _id: new ObjectID(),
    name: 'Dummy Station',
    division: 'Ocean State',
    voltage: '115 kV',
    stationConfig: 'Open-Air'
  }
];

const arcCalc1584 = {
  sub: 'Test Station',
  division: 'Bay State West',
  faultType: '3 phase',
  stationConfig: 'Metalclad',
  grounded: true,
  lineVoltage: 13.8,
  faultCurrent: 5432,
  relayOpTime: 0.973
};

const populateStations = done => {
  Station.remove({})
    .then(() => {
      return Station.insertMany(stations);
    })
    .then(() => done());
};

module.exports = { stations, arcCalc1584, populateStations };
