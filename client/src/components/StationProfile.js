import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { CalculationEntry, LoginCard } from './common';
import * as actions from '../actions';

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
          <div className="container">
            <div className="row">
              <div className="col s12 m6">
                <h1>{name || ' still rendering'}</h1>
                <h3>{division || 'still rendering'}</h3>
                <h5>{voltage || 'still rendering'}</h5>
              </div>
              <div
                className="col s12 m3 offset-m3"
                style={{ marginTop: '2.8rem' }}
              >
                <Link
                  class="waves-effect waves-light btn-large amber darken-2"
                  style={{ width: '100%' }}
                  to="/"
                >
                  Edit Station
                </Link>
                <Link
                  class="waves-effect waves-light btn-large teal"
                  style={{ width: '100%' }}
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
              </div>
            </div>

            {stationCalcs === undefined || stationCalcs.length === 0 ? (
              <p class="col s6">
                There are no calculations for this station yet
              </p>
            ) : (
              stationCalcs.map(e => {
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
              })
            )}
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

function mapStateToProps(state) {
  return {
    auth: state.auth,
    stationInfo: state.stations.currentStation || 'Still retrieving data'
  };
}

export default connect(
  mapStateToProps,
  actions
)(StationProfile);
