const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

var { app } = require('./../server');
const { Station } = require('./../models/station');
const { ArcCalc1584 } = require('./../models/arcCalc1584');
const { ArcCalcArcPro } = require('./../models/arcCalcArcPro');
const { User } = require('./../models/user');
const {
  stations,
  arcCalc1584calculations,
  arcCalcArcProCalculations,
  users,
  populateStations,
  populate1584calculations,
  populateArcProcalculations,
  populateUsers
} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateStations);
beforeEach(populate1584calculations);
beforeEach(populateArcProcalculations);

describe('POST /stations', () => {
  var name = 'My First Station';
  var division = 'Bay State West';
  var voltage = '13.8 kV';
  var stationConfig = 'Metalclad';

  it('should add a new station', done => {
    request(app)
      .post('/api/stations')
      // .set('x-auth', users[0].tokens[0].token)
      .set({ 'x-auth': users[0].tokens[0].token, 'user-role': users[0].role })
      .send({ name, division, voltage, stationConfig })
      .expect(200)
      .expect(res => {
        expect(res.body.name).toBe(name);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Station.find({ name })
          .then(stations => {
            expect(stations.length).toBe(1);
            expect(stations[0].voltage).toBe(voltage);
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });

  it('should add a station with the same name but different voltage', done => {
    request(app)
      .post('/api/stations')
      .set('x-auth', users[0].tokens[0].token)
      .send({
        name: 'Test Station',
        division,
        voltage: '69 kV',
        stationConfig
      })
      .expect(200)
      .expect(res => {
        expect(res.body.name).toBe('Test Station');
        expect(res.body.voltage).toBe('69 kV');
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Station.findOne({ name: 'Test Station', voltage: '69 kV' })
          .then(station => {
            expect(station.name).toBe('Test Station');
            expect(station.voltage).toBe('69 kV');
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });

  it('should not add a station with the same name and voltage', done => {
    request(app)
      .post('/api/stations')
      // .set('x-auth', users[0].tokens[0].token)
      .set({ 'x-auth': users[0].tokens[0].token, 'user-role': users[0].role })
      .send({
        name: 'Test Station',
        division,
        voltage: '13.8 kV',
        stationConfig
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Station.find()
          .then(stations => {
            expect(stations.length).toBe(2);
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });

  it('should not add a station with invalid body', done => {
    request(app)
      .post('/api/stations')
      // .set('x-auth', users[0].tokens[0].token)
      .set({ 'x-auth': users[0].tokens[0].token, 'user-role': users[0].role })
      .send({ name, division: 'Invalid Division', voltage, stationConfig })
      .expect(400)
      .end((err, res) => {
        if (err) {
          done(err);
        }

        Station.find()
          .then(stations => {
            expect(stations.length).toBe(2);
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });

  it('should not add a station if the user has Read access', done => {
    request(app)
      .post('/api/stations')
      .set({ 'x-auth': users[2].tokens[0].token, 'user-role': users[2].role })
      .send({
        name: 'New Station',
        division: 'Bay State West',
        voltage: '13.8 kV',
        stationConfig: 'Metalclad'
      })
      .expect(401)
      .end(done);
  });
});

describe('GET /stations', () => {
  it('should return all stations in the database', done => {
    request(app)
      .get('/api/stations')
      // .set('x-auth', users[0].tokens[0].token)
      .set({ 'x-auth': users[0].tokens[0].token, 'user-role': users[0].role })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Station.find()
          .then(stations => {
            expect(stations.length).toBe(2);
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });
});

describe('GET /stations/:id', () => {
  it('should return the station with the requested id', done => {
    var id = stations[0]._id.toHexString();
    request(app)
      .get(`/api/stations/${id}`)
      // .set('x-auth', users[0].tokens[0].token)
      .set({ 'x-auth': users[0].tokens[0].token, 'user-role': users[0].role })
      .expect(200)
      .expect(res => {
        expect(res.body.station.name).toBe(stations[0].name);
      })
      .end(done);
  });

  it('should return 404 if station not found', done => {
    var unkownId = new ObjectID().toHexString;
    request(app)
      .get(`/api/stations/${unkownId}`)
      // .set('x-auth', users[0].tokens[0].token)
      .set({ 'x-auth': users[0].tokens[0].token, 'user-role': users[0].role })
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', done => {
    request(app)
      .get(`/api/stations/123`)
      // .set('x-auth', users[0].tokens[0].token)
      .set({ 'x-auth': users[0].tokens[0].token, 'user-role': users[0].role })
      .expect(404)
      .end(done);
  });
});

describe('DELETE /stations/:id', () => {
  it('should delete a station with the requested id', done => {
    var id = stations[0]._id.toHexString();
    request(app)
      .delete(`/api/stations/${id}`)
      .set({ 'x-auth': users[0].tokens[0].token, 'user-role': users[0].role })
      .expect(200)
      .expect(res => {
        expect(res.body.station.name).toBe(stations[0].name);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Station.findById(id)
          .then(station => {
            expect(station).toBeFalsy();
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });

  it('should retunr 401 if user is not Admin', done => {
    var id = stations[0]._id.toHexString();
    request(app)
      .delete(`/api/stations/${id}`)
      .set({ 'x-auth': users[1].tokens[0].token, 'user-role': users[1].role })
      .expect(401)
      .end(done);
  });

  it('should return 404 if station not found', done => {
    var unkownId = new ObjectID().toHexString;
    request(app)
      .delete(`/api/stations/${unkownId}`)
      .set({ 'x-auth': users[0].tokens[0].token, 'user-role': users[0].role })
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', done => {
    request(app)
      .delete('/api/stations/123')
      .set({ 'x-auth': users[0].tokens[0].token, 'user-role': users[0].role })
      .expect(404)
      .end(done);
  });
});

describe('PATCH /stations/:id', () => {
  it('should update station', done => {
    var hexId = stations[0]._id.toHexString();
    var updatedName = 'Updated Station';
    request(app)
      .patch(`/api/stations/${hexId}`)
      .send({ name: updatedName })
      .expect(200)
      .expect(res => {
        expect(res.body.station.name).toBe(updatedName);
      })
      .end(done);
  });

  it('should not update station if name is all white spaces', done => {
    var id = stations[0]._id;
    var updatedName = '        ';
    request(app)
      .patch(`/api/stations/${id.toHexString()}`)
      .send({ name: updatedName })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Station.findById(id)
          .then(station => {
            expect(station.name).toBe(stations[0].name);
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });

  it('should not update if division is invalid', done => {
    var id = stations[0]._id;
    var updatedDivision = 'Invalid';
    request(app)
      .patch(`/api/stations/${id.toHexString()}`)
      .send({ division: updatedDivision })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Station.findById(id)
          .then(station => {
            expect(station.division).toBe(stations[0].division);
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });

  it('should not update if stationConfig is invalid', done => {
    var id = stations[0]._id;
    var updatedStationConfig = 'Invalid';
    request(app)
      .patch(`/api/stations/${id.toHexString()}`)
      .send({ stationConfig: updatedStationConfig })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Station.findById(id)
          .then(station => {
            expect(station.stationConfig).toBe(stations[0].stationConfig);
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });
});

describe('POST /arccalc1584', () => {
  it('should post an arc flash calculation', done => {
    var calcParams = arcCalc1584calculations[0].calcParams;
    var results = arcCalc1584calculations[0].results;
    request(app)
      .post('/api/arccalc1584')
      .set('x-auth', users[0].tokens[0].token)
      .send({ calcParams, results })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Station.findOne({ name: calcParams.sub })
          .then(station => {
            expect(station.stationCalcs.length).toBe(3);
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });

  it('should not post an arc flash calculation if there is missing data', done => {
    // missing relayOpTime
    var calcParams = {
      sub: 'Test Station',
      sub2: 'Dummy Station',
      division: 'Bay State West',
      faultType: '3 phase',
      stationConfig: 'Metalclad',
      electrodeConfig: 'HCB',
      lineVoltage: '13.8 kV',
      boltedFaultCurrent: 10042
    };

    var results = {
      incidentEnergy: 6.91,
      calculatedArcFlashEnergy: 30.95
    };
    request(app)
      .post('/api/arccalc1584')
      .set('x-auth', users[0].tokens[0].token)
      .send({ calcParams, results })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Station.findOne({ name: calcParams.sub })
          .then(station => {
            expect(station.stationCalcs.length).toBe(2);
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });

  it('should return 404 if there is no associated substation in the database', done => {
    var calcParams = {
      sub: 'Test Station',
      sub2: 'Dummy Station',
      division: 'Bay State West',
      faultType: '3 phase',
      stationConfig: 'Metalclad',
      electrodeConfig: 'HCB',
      lineVoltage: '69 kV',
      boltedFaultCurrent: 10042,
      totalClearingTime: 0.983
    };

    var results = {
      incidentEnergy: 6.91,
      calculatedArcFlashEnergy: 30.95
    };
    request(app)
      .post('/api/arccalc1584')
      .set('x-auth', users[0].tokens[0].token)
      .send({ calcParams, results })
      .expect(404)
      .end(done);
  });
});

describe('GET /arccalc1584', () => {
  it('should return all 1584 calculations in the database', done => {
    request(app)
      .get('/api/arccalc1584')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }

        ArcCalc1584.find()
          .then(calculations => {
            expect(calculations.length).toBe(2);
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });
});

describe('GET /arccalc1584/:id', () => {
  it('should return the 1584 calulation with the requested id', done => {
    var id = arcCalc1584calculations[0]._id.toHexString();
    request(app)
      .get(`/api/arccalc1584/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.calculation.calcParams.boltedFaultCurrent).toBe(
          arcCalc1584calculations[0].calcParams.boltedFaultCurrent
        );
      })
      .end(done);
  });

  it('should return 404 if 1584 calculation not found', done => {
    var unkownId = new ObjectID().toHexString;
    request(app)
      .get(`/api/arccalc1584/${unkownId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', done => {
    request(app)
      .get(`/api/arccalc1584/123`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /arccalc1584/:id', () => {
  it('should return the updated station without the calculation in stationCalcs upon successful deletion', done => {
    var id = arcCalc1584calculations[0]._id.toHexString();
    request(app)
      .delete(`/api/arccalc1584/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.updatedStation.stationCalcs.length).toBe(1);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        ArcCalc1584.findById(id)
          .then(calculation => {
            expect(calculation).toBeNull();
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });

  it('should return 404 if 1584 calculation not found', done => {
    var unkownId = new ObjectID().toHexString;
    request(app)
      .delete(`/api/arccalc1584/${unkownId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', done => {
    request(app)
      .delete(`/api/arccalc1584/123`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  // I dont know if I even need to do this. Especially if I will be implementing deleting all associated calculations when I delete a station

  // it('should return 404 if associated station is not found', done => {
  //   arcCalc1584calculations[0].calcParams['sub'] = 'Unkown Station';
  //   console.log(arcCalc1584calculations[0].calcParams['sub']);
  //   var id = arcCalc1584calculations[0]._id.toHexString();
  //   request(app)
  //     .delete(`/arccalc1584/${id}`)
  //     .expect(404)
  //     .end(done);
  // });
});

describe('POST /arccalcarcpro', () => {
  it('should post an arc flash calculation', done => {
    var calcParams = arcCalcArcProCalculations[0].calcParams;
    var arcProInput = arcCalcArcProCalculations[0].arcProInput;
    var arcProResults = arcCalcArcProCalculations[0].arcProResults;
    var results = arcCalcArcProCalculations[0].results;
    request(app)
      .post('/api/arccalcarcpro')
      .set('x-auth', users[0].tokens[0].token)
      .send({ calcParams, arcProInput, arcProResults, results })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Station.findOne({ name: calcParams.sub })
          .then(station => {
            expect(station.stationCalcs.length).toBe(3);
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });

  it('should not post an arc flash calculation if there is missing data', done => {
    // missing flux
    var calcParams = arcCalcArcProCalculations[0].calcParams;
    var arcProInput = arcCalcArcProCalculations[0].arcProInput;
    var arcProResults = {
      arcVoltage: 408,
      arcEnergy: 912,
      maxHeatFlux: 3414,
      heatFluxAtCircleR: 36.4,
      heatFluxAtCircleZ: 4
    };
    var results = arcCalcArcProCalculations[0].results;
    request(app)
      .post('/api/arccalcarcpro')
      .set('x-auth', users[0].tokens[0].token)
      .send({ calcParams, arcProInput, arcProResults, results })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Station.findOne({ name: calcParams.sub })
          .then(station => {
            expect(station.stationCalcs.length).toBe(2);
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });

  it('should return 404 if there is no associated substation in the database', done => {
    var calcParams = {
      sub: 'Dummy Station',
      sub2: 'Test Station',
      division: 'Ocean State',
      faultType: '3 phase',
      stationConfig: 'Metalclad',
      lineVoltage: '69 kV',
      faultCurrent: 10042,
      relayOpTime: 0.983
    };
    var arcProInput = arcCalcArcProCalculations[0].arcProInput;
    var arcProResults = arcCalcArcProCalculations[0].arcProResults;
    var results = arcCalcArcProCalculations[0].results;
    request(app)
      .post('/api/arccalcarcpro')
      .set('x-auth', users[0].tokens[0].token)
      .send({ calcParams, arcProInput, arcProResults, results })
      .expect(404)
      .end(done);
  });
});

describe('GET /arccalcarcpro', () => {
  it('should return all ArcPro calculations in the database', done => {
    request(app)
      .get('/api/arccalcarcpro')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }

        ArcCalcArcPro.find()
          .then(calculations => {
            expect(calculations.length).toBe(2);
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });
});

describe('GET /arccalcarcpro/:id', () => {
  it('should return the arcpro calulation with the requested id', done => {
    var id = arcCalcArcProCalculations[0]._id.toHexString();
    request(app)
      .get(`/api/arccalcarcpro/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.calculation.calcParams.faultCurrent).toBe(
          arcCalcArcProCalculations[0].calcParams.faultCurrent
        );
      })
      .end(done);
  });

  it('should return 404 if arcpro calculation not found', done => {
    var unkownId = new ObjectID().toHexString;
    request(app)
      .get(`/api/arccalcarcpro/${unkownId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', done => {
    request(app)
      .get(`/api/arccalcarcpro/123`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /arccalcarcpro/:id', () => {
  it('should return the updated station without the calculation in stationCalcs upon successful deletion', done => {
    var id = arcCalcArcProCalculations[0]._id.toHexString();
    request(app)
      .delete(`/api/arccalcarcpro/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.updatedStation.stationCalcs.length).toBe(1);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        ArcCalcArcPro.findById(id)
          .then(calculation => {
            expect(calculation).toBeNull();
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });

  it('should return 404 if 1584 calculation not found', done => {
    var unkownId = new ObjectID().toHexString;
    request(app)
      .delete(`/api/arccalcarcpro/${unkownId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', done => {
    request(app)
      .delete(`/api/arccalcarcpro/123`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', done => {
    request(app)
      .get('/api/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if user is not authenticated', done => {
    request(app)
      .get('/api/users/me')
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', done => {
    var email = 'example@example.com';
    var password = '123nmb32!';

    request(app)
      .post('/api/users')
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end(err => {
        if (err) {
          return done(err);
        }

        User.findOne({ email })
          .then(user => {
            expect(user).toBeTruthy();
            expect(user.password).not.toBe(password);
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should return validation errors if request invalid', done => {
    var email = 'example2@example2.com';
    var password = 'shortpw';

    request(app)
      .post('/api/users')
      .send({ email, password })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', done => {
    var email = users[0].email;
    var password = 'aLongerpw';

    request(app)
      .post('/api/users')
      .send({ email, password })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', done => {
    request(app)
      .post('/api/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens[1]).toMatchObject({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should reject an invalid login', done => {
    request(app)
      .post('/api/users/login')
      .send({
        email: users[1].email,
        password: 'someWrongPassword'
      })
      .expect(400)
      .expect(res => {
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens.length).toBe(1);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', done => {
    request(app)
      .delete('/api/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id)
          .then(user => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch(e => done(e));
      });
  });
});
