const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Station } = require('./../../models/station');
const { ArcCalc1584 } = require('./../../models/arcCalc1584');
const { User } = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const arcCalc1584calculations = [
  {
    _id: new ObjectID(),
    calcParams: {
      sub: 'Test Station',
      sub2: 'Dummy Station',
      division: 'Bay State West',
      faultType: '3 phase',
      stationConfig: 'Metalclad',
      electrodeConfig: 'VCB',
      lineVoltage: '13.8 kV',
      boltedFaultCurrent: 5432,
      totalClearingTime: 0.973,
      comment: 'No comment'
    },
    results: {
      incidentEnergy: 7.03,
      calculatedArcFlashEnergy: 31.5,
      hrcLevel: '4'
    }
  },
  {
    _id: new ObjectID(),
    calcParams: {
      sub: 'Test Station',
      sub2: 'Dummy Station',
      division: 'Bay State West',
      faultType: '3 phase',
      stationConfig: 'Metalclad',
      electrodeConfig: 'HCB',
      lineVoltage: '13.8 kV',
      boltedFaultCurrent: 10042,
      totalClearingTime: 0.521,
      comment: 'No Comment'
    },
    results: {
      incidentEnergy: 6.91,
      calculatedArcFlashEnergy: 30.95,
      hrcLevel: '4'
    }
  }
];

const stations = [
  {
    _id: new ObjectID(),
    name: 'Test Station',
    division: 'Bay State West',
    voltage: '13.8 kV',
    stationConfig: 'Metalclad',
    _creator: userOneId
    // stationCalcs: arcCalc1584calculations
  },
  {
    _id: new ObjectID(),
    name: 'Dummy Station',
    division: 'Ocean State',
    voltage: '115 kV',
    stationConfig: 'Open-Air',
    _creator: userTwoId
  }
];

const users = [
  {
    _id: userOneId,
    email: 'max@example.com',
    password: 'userOnePass',
    tokens: [
      {
        access: 'auth',
        token: jwt
          .sign({ _id: userOneId, access: 'auth' }, process.env.JWT_SECRET)
          .toString()
      }
    ]
  },
  {
    _id: userTwoId,
    email: 'nick@example.com',
    password: 'userTwoPass',
    tokens: [
      {
        access: 'auth',
        token: jwt
          .sign({ _id: userTwoId, access: 'auth' }, process.env.JWT_SECRET)
          .toString()
      }
    ]
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

const populateUsers = done => {
  User.remove({})
    .then(() => {
      // we want to create new instances because if we just insertMany like we do in the populateTodos, the middleware will never be called and the passwords will not be hashed
      var userOne = new User(users[0]).save();
      var userTwo = new User(users[1]).save();

      //The callback will not be fired until both userOne and userTwo promises are resolved
      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

module.exports = {
  stations,
  arcCalc1584calculations,
  users,
  populateStations,
  populate1584calculations,
  populateUsers
};
