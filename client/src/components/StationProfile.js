import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { CalculationEntry, LoginCard } from './common';
import { fetchStationInfo } from '../actions';

class StationProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stationID: this.props.location.state._id
    };
  }

  componentDidMount() {
    this.props.fetchStationInfo(this.props.auth.xauth, this.state.stationID);
  }

  renderContent() {
    switch (this.props.auth._id) {
      case null:
        return;

      case false:
        return <LoginCard />;

      default: {
        const {
          name,
          voltage,
          division,
          stationConfig,
          stationCalcs
        } = this.props.stationInfo;

        return (
          <div>
            <div className="row z-depth-2" style={styles.stationInfoContainer}>
              <div className="col s12 m6" style={{ padding: 10 }}>
                <p style={styles.stationName}>{name || ' still rendering'}</p>
                <h3 style={styles.divisionName}>
                  {division || 'still rendering'}
                </h3>
                <h5 style={styles.voltageName}>
                  {voltage || 'still rendering'}
                </h5>
              </div>
              <div
                className="col s12 m3 offset-m3"
                style={{ marginTop: '2.8rem', marginBottom: '2.8rem' }}
              >
                <Link
                  class="waves-effect waves-light btn-large"
                  style={{
                    width: '100%',
                    backgroundColor: '#98A2DB',
                    marginBottom: 3
                  }}
                  to={{
                    pathname: '/editStation',
                    state: {
                      _id: this.state.stationID,
                      name,
                      voltage,
                      stationConfig,
                      division
                    }
                  }}
                >
                  Edit Station
                </Link>

                {parseFloat(voltage) < 20 ? (
                  <Link
                    class="waves-effect waves-light btn-large"
                    style={{
                      width: '100%',
                      backgroundColor: '#D6C985',
                      marginTop: 3
                    }}
                    to={{
                      pathname: '/add1584Calculation',
                      state: {
                        _id: this.state.stationID,
                        name,
                        voltage,
                        stationConfig,
                        division
                      }
                    }}
                  >
                    Add New Calc
                  </Link>
                ) : (
                  <Link
                    class="waves-effect waves-light btn-large"
                    style={{
                      width: '100%',
                      backgroundColor: '#D6C985',
                      marginTop: 3
                    }}
                    to={{
                      pathname: '/addArcProCalculation',
                      state: {
                        _id: this.state.stationID,
                        name,
                        voltage,
                        stationConfig,
                        division
                      }
                    }}
                  >
                    Add New Calc
                  </Link>
                )}
              </div>
            </div>

            <div style={{ margin: '35px 15px' }}>
              {stationCalcs === undefined || stationCalcs.length === 0 ? (
                <p class="col s6">
                  There are no calculations for this station yet
                </p>
              ) : (
                stationCalcs.reverse().map((e, index) => {
                  if (index === 0) {
                    return (
                      <CalculationEntry
                        date={e.calcParams.createdAt.slice(5, 10)}
                        comment={e.calcParams.comment}
                        incidentEnergy={e.results.incidentEnergy}
                        eightCal={e.results.calculatedArcFlashEnergy}
                        hrcLevel={e.results.hrcLevel}
                        calcID={e._id}
                        wholeCalcObject={e}
                      />
                    );
                  }
                  return null;
                })
              )}
            </div>

            <div style={{ margin: '20px 15px' }} className="white z-depth-1 ">
              <h5 style={{ padding: '10px 0px 0px 5px' }}>
                Previous Calculations:
              </h5>
              <table className="striped col s12">
                <thead>
                  <tr>
                    <th className="flow-text center-align">Date:</th>
                    <th className="flow-text center-align">
                      Arc Flash Energy:
                    </th>
                    <th className="flow-text center-align">Incident Energy:</th>
                    <th className="flow-text center-align">HRC Level:</th>
                    <th />
                  </tr>
                </thead>

                <tbody>
                  {stationCalcs === undefined || stationCalcs.length === 0 ? (
                    <p class="col s6">
                      There are no calculations for this station yet
                    </p>
                  ) : (
                    stationCalcs.map((e, index) => {
                      if (index === 0) {
                        return null;
                      }
                      return (
                        <tr>
                          <td className="center-align">
                            {e.calcParams.createdAt.slice(5, 10)}
                          </td>
                          <td className="center-align">
                            {e.results.calculatedArcFlashEnergy}
                          </td>
                          <td className="center-align">
                            {e.results.incidentEnergy}
                          </td>
                          <td className="center-align">{e.results.hrcLevel}</td>
                          <td>
                            {parseFloat(e.calcParams.lineVoltage) < 20 ? (
                              <Link
                                to={{
                                  pathname: '/1584CalculationDetails',
                                  state: { calculation: e }
                                }}
                                className="waves-effect waves-light btn-small col s2 offset-s5 indigo"
                                style={{
                                  marginBottom: '10px',
                                  paddingRight: '10px'
                                }}
                              >
                                View
                              </Link>
                            ) : (
                              <Link
                                to={{
                                  pathname: '/ArcProCalculationDetails',
                                  state: { calculation: e }
                                }}
                                className="waves-effect waves-light btn-small col s2 offset-s5 indigo"
                                style={{
                                  marginBottom: '10px',
                                  paddingRight: '10px'
                                }}
                              >
                                View
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
    }
  }

  render() {
    // return <div />;
    return <div>{this.renderContent()}</div>;
  }
}

const styles = {
  stationInfoContainer: {
    backgroundColor: '#F6F3E4',
    margin: 5
  },
  stationName: {
    fontSize: 60,
    marginTop: 0,
    marginBottom: 0
  },
  divisionName: {
    fontSize: 40,
    marginTop: 0,
    marginBottom: 0
  },
  voltageName: {
    fontSize: 20,
    marginTop: 5,
    marginBottom: 0
  }
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    stationInfo: state.stations.currentStation || 'Still retrieving data'
  };
}

export default connect(
  mapStateToProps,
  { fetchStationInfo }
)(StationProfile);
