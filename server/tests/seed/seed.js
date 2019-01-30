const { ObjectID } = require('mongodb');

const { Station } = require('./../../models/station');
const { ArcCalc1584 } = require('./../../models/arcCalc1584');

const arcCalc1584calculations = [
  {
    _id: new ObjectID(),
    calcParams: {
      sub: 'Test Station',
      division: 'Bay State West',
      faultType: '3 phase',
      stationConfig: 'Metalclad',
      grounded: true,
      lineVoltage: 13.8,
      faultCurrent: 5432,
      relayOpTime: 0.973
    },
    results: {
      arcCurrent: 5.327,
      incidentEnergy: 9.114,
      eightCalBoundary: 41.16
    }
  },
  {
    _id: new ObjectID(),
    calcParams: {
      sub: 'Test Station',
      division: 'Bay State West',
      faultType: '3 phase',
      stationConfig: 'Metalclad',
      grounded: true,
      lineVoltage: 4.16,
      faultCurrent: 1042,
      relayOpTime: 0.321
    },
    results: {
      arcCurrent: 1.051,
      incidentEnergy: 0.55,
      eightCalBoundary: 2.298
    }
  }
];

const stations = [
  {
    _id: new ObjectID(),
    name: 'Test Station',
    division: 'Bay State West',
    voltage: '13.8 kV',
    stationConfig: 'Metalclad'
    // stationCalcs: arcCalc1584calculations
  },
  {
    _id: new ObjectID(),
    name: 'Dummy Station',
    division: 'Ocean State',
    voltage: '115 kV',
    stationConfig: 'Open-Air'
  }
];

const populateStations = done => {
  Station.remove({})
    .then(() => {
      return Station.insertMany(stations);
    })
    .then(() => done());
};

const populate1584calculations = done => {
  ArcCalc1584.remove({})
    .then(() => {
      ArcCalc1584.insertMany(arcCalc1584calculations).then(calculations => {
        Station.findOne({ name: calculations[0].calcParams.sub }).then(
          station => {
            station.stationCalcs.push(calculations[0]._id, calculations[1]._id);
            return station.save();
          }
        );
      });
    })
    .then(() => done());
};

module.exports = {
  stations,
  arcCalc1584calculations,
  populateStations,
  populate1584calculations
};
