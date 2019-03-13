import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StationEntry, LoginCard } from './common';
import * as actions from '../actions';

class Stations extends Component {
  componentDidMount() {
    this.props.fetchStations(this.props.auth.xauth);
  }

  renderContent() {
    switch (this.props.auth._id) {
      case null:
        return;

      case false:
        return <LoginCard />;

      default:
        return (
          <div>
            <div
              class="row amber darken-4"
              style={{ borderBottom: '2px solid black', textAlign: 'center' }}
            >
              <div class="col s3">
                <span class="flow-text">Station Name:</span>
              </div>
              <div class="col s3">
                <span class="flow-text">Division:</span>
              </div>
              <div class="col s2">
                <span class="flow-text">Voltage (kV):</span>
              </div>
              <div class="col s2">
                <span class="flow-text">Number of Calcs:</span>
              </div>
            </div>

            {this.props.stations.map(e => {
              return (
                <StationEntry
                  name={e.name}
                  division={e.division}
                  voltage={e.voltage}
                  calcs={e.stationCalcs.length}
                  stationID={e._id}
                />
              );
            })}
          </div>
        );
    }
  }

  render() {
    return <div class="row">{this.renderContent()}</div>;
  }
}

function mapStateToProps(state) {
  return { auth: state.auth, stations: state.stations.stationsArray };
}
export default connect(
  mapStateToProps,
  actions
)(Stations);
