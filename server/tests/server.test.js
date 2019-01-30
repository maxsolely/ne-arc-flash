const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

var { app } = require('./../server');
const { Station } = require('./../models/station');
const { stations, arcCalc1584, populateStations } = require('./seed/seed');

beforeEach(populateStations);

describe('POST /stations', () => {
  var name = 'My First Station';
  var division = 'Bay State West';
  var voltage = '13.8 kV';
  var stationConfig = 'Metalclad';

  it('should add a new station', done => {
    request(app)
      .post('/stations')
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

  it('should not add a station with the same name', done => {
    request(app)
      .post('/stations')
      .send({ name: 'Test Station', division, voltage, stationConfig })
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
      .post('/stations')
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
});

describe('GET /stations', () => {
  it('should return all stations in the database', done => {
    request(app)
      .get('/stations')
      .expect(200)
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
});

describe('GET /stations/:id', () => {
  it('should return the station with the requested id', done => {
    var id = stations[0]._id.toHexString();
    request(app)
      .get(`/stations/${id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.station.name).toBe(stations[0].name);
      })
      .end(done);
  });

  it('should return 404 if station not found', done => {
    var unkownId = new ObjectID().toHexString;
    request(app)
      .get(`/stations/${unkownId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', done => {
    request(app)
      .get(`/stations/123`)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /stations/:id', () => {
  it('should delete a station with the requested id', done => {
    var id = stations[1]._id.toHexString();
    request(app)
      .delete(`/stations/${id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.station.name).toBe(stations[1].name);
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

  it('should return 404 if station not found', done => {
    var unkownId = new ObjectID().toHexString;
    request(app)
      .delete(`/stations/${unkownId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', done => {
    request(app)
      .delete('/stations/123')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /stations/:id', () => {
  it('should update station', done => {
    var hexId = stations[0]._id.toHexString();
    var updatedName = 'Updated Station';
    request(app)
      .patch(`/stations/${hexId}`)
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
      .patch(`/stations/${id.toHexString()}`)
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
      .patch(`/stations/${id.toHexString()}`)
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
      .patch(`/stations/${id.toHexString()}`)
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
    var calcParams = arcCalc1584;
    request(app)
      .post('/arccalc1584')
      .send({ calcParams })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Station.findOne({ name: calcParams.sub })
          .then(station => {
            expect(station.stationCalcs.length).toBe(1);
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });
});
