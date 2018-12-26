const { ObjectID } = require('mongodb');

const { Station } = require('./../../models/station');

const stations = [
  {
    _id: new ObjectID(),
    name: 'Test Station',
    division: 'Worcester',
    voltage: '13.8 kV',
    stationType: 'Metalclad'
  },
  {
    _id: new ObjectID(),
    name: 'Dummy Station',
    division: 'Ocean State',
    voltage: '115 kV',
    stationType: 'Open-Air'
  }
];

const populateStations = done => {
  Station.remove({})
    .then(() => {
      return Station.insertMany(stations);
    })
    .then(() => done());
};

module.exports = { stations, populateStations };
