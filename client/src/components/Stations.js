import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StationEntry } from './common';
import * as actions from '../actions';

class Stations extends Component {
  componentDidMount() {
    this.props.fetchStations(this.props.auth.xauth);
  }

  render() {
    return (
      <div class="container">
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
          <div class="col s3">
            <span class="flow-text">Voltage (kV):</span>
          </div>
          <div class="col s3">
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
            />
          );
        })}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { auth: state.auth, stations: state.stations };
}
export default connect(
  mapStateToProps,
  actions
)(Stations);
