const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

var { app } = require('./../server');
const { Station } = require('./../models/station');
const { stations, populateStations } = require('./seed/seed');

beforeEach(populateStations);

describe('POST /stations', () => {
  var name = 'My First Station';
  var division = 'Worcester';
  var voltage = '13.8 kV';
  var stationType = 'Metalclad';

  it('should add a new station', done => {
    request(app)
      .post('/stations')
      .send({ name, division, voltage, stationType })
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
      .send({ name: 'Test Station', division, voltage, stationType })
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
      .send({ name, division: 'Invalid Division', voltage, stationType })
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

  // I NEED TO ADD THIS. I NEED TO CHECK THE DATA WHEN I CLEAN THE BODY
  //   it('should not update a station with invalid body', done => {
  //     var id = stations[1]._id;
  //     request(app)
  //       .patch(`/stations/${id.toHexString()}`)
  //       .send({ division: 'Invalid Division' })
  //       .expect(400)
  //       .end((err, res) => {
  //         if (err) {
  //           done(err);
  //         }

  //         Station.findById(id)
  //           .then(station => {
  //             expect(station.division).toBe('Ocean State');
  //             done();
  //           })
  //           .catch(e => {
  //             done(e);
  //           });
  //       });
  //   });
});
