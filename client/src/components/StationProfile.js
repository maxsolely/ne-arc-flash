import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { CalculationEntry } from './common';
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
        return <h1>you need to be logged in</h1>;

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
            <div
              class="row"
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '0px'
              }}
            >
              <h1 class="col s6">{name || this.props.stationInfo}</h1>
              <Link
                class="col s2 offset-s4 waves-effect waves-light btn-large"
                to="/"
              >
                Edit Station
              </Link>
            </div>
            <div
              class="row"
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '0px'
              }}
            >
              <h4 class="col s6">{voltage || this.props.stationInfo}</h4>
              <Link
                class="col s2 offset-s4 waves-effect waves-light btn-large"
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
                New Calc
              </Link>
            </div>
            <div class="row">
              <p class="col s6">{division || this.props.stationInfo}</p>
            </div>
            <div class="row">
              <p class="col s6">{stationConfig || this.props.stationInfo}</p>
            </div>
            {stationCalcs === undefined || stationCalcs.length === 0 ? (
              <p class="col s6">
                There are no calculations for this station yet
              </p>
            ) : (
              stationCalcs.map(e => {
                return (
                  <CalculationEntry
                    faultType={e.calcParams.faultType}
                    incidentEnergy={e.results.incidentEnergy}
                    eightCal={e.results.eightCalBoundary}
                    hrcLevel={e.results.hrcLevel}
                    calcID={e._id}
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
