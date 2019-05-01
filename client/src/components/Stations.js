import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { StationEntry, LoginCard } from './common';
import { fetchStations } from '../actions';
import Dashboard from './Dashboard';

class Stations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stationSearch: '',
      divisionSearch: ''
    };
  }

  componentDidMount() {
    this.props.fetchStations(this.props.auth.xauth);
  }

  handleStationSearchChange(event) {
    this.setState({ stationSearch: event.target.value });
  }

  handleDivisionSearchChange(event) {
    this.setState({ divisionSearch: event.target.value });
  }

  renderContent() {
    switch (this.props.auth._id) {
      case null:
        return;

      case false:
        return <LoginCard />;

      default: {
        const { stationSearch, divisionSearch } = this.state;
        let stations = this.props.stations;

        if (stationSearch !== '') {
          stations = stations.filter(e => {
            const name = e.name.toLowerCase();
            return name.indexOf(stationSearch.toLowerCase()) >= 0;
          });
        }

        if (divisionSearch !== '') {
          stations = stations.filter(e => {
            const divisionName = e.division.toLowerCase();
            return divisionName.indexOf(divisionSearch.toLowerCase()) >= 0;
          });
        }
        return (
          <div>
            <Dashboard />
            {/* <div className="z-depth-1 white">
              <div className="row"> */}
            <div style={{ margin: '20px 15px' }} className="white z-depth-1 ">
              <div className="row">
                <div className="input-field col s12 m6">
                  <i className="material-icons prefix">search</i>
                  <input
                    id="icon_prefix_station"
                    type="text"
                    value={this.state.stationSearch}
                    onChange={this.handleStationSearchChange.bind(this)}
                  />
                  <label for="icon_prefix_station">
                    {this.state.stationSearch === ''
                      ? 'Search Station Name'
                      : ''}
                  </label>
                </div>
                <div className="input-field col s12 m6">
                  <i className="material-icons prefix">landscape</i>
                  <input
                    id="icon_prefix_division"
                    type="text"
                    value={this.state.divisionSearch}
                    onChange={this.handleDivisionSearchChange.bind(this)}
                  />
                  <label for="icon_prefix_division">
                    {this.state.divisionSearch === ''
                      ? 'Search By Division'
                      : ''}
                  </label>
                </div>
              </div>

              <table className="striped col s12" style={styles.tableStyle}>
                <thead>
                  <tr>
                    <th className="flow-text center-align">Station Name:</th>
                    <th className="flow-text center-align">Division:</th>
                    <th className="flow-text center-align">Voltage (kV):</th>
                    <th className="flow-text center-align">Calcs:</th>
                    <th />
                  </tr>
                </thead>

                <tbody>
                  {stations.map(e => {
                    return (
                      <tr>
                        <td className="center-align">{e.name}</td>
                        <td className="center-align">{e.division}</td>
                        <td className="center-align">
                          {e.voltage.slice(0, -2)}
                        </td>
                        <td className="center-align">
                          {e.stationCalcs.length}
                        </td>
                        <td>
                          <Link
                            to={{
                              pathname: '/stationProfile',
                              state: { _id: e._id }
                            }}
                            className="waves-effect waves-light btn-small col s2 offset-s3 indigo"
                            style={{
                              marginBottom: '10px',
                              paddingRight: '10px'
                            }}
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          // </div>
        );
      }
    }
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

const styles = {
  tableStyle: {
    marginTop: 15
  }
};

function mapStateToProps(state) {
  return { auth: state.auth, stations: state.stations.stationsArray };
}
export default connect(
  mapStateToProps,
  { fetchStations }
)(Stations);
