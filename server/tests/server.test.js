const expect = require('expect');
const request = require('supertest');

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
