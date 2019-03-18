import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { StationEntry, LoginCard } from './common';
import * as actions from '../actions';

class Stations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: ''
    };
  }

  componentDidMount() {
    this.props.fetchStations(this.props.auth.xauth);
  }

  handleSearchChange(event) {
    this.setState({ search: event.target.value });
  }

  renderContent() {
    switch (this.props.auth._id) {
      case null:
        return;

      case false:
        return <LoginCard />;

      default: {
        const { search } = this.state;
        let stations = this.props.stations;
        if (search !== '') {
          stations = stations.filter(e => {
            return e.name.indexOf(search) >= 0;
          });
        }
        // if (search !== '' && stations.name.indexOf(search) === -1) {
        //   return stations;
        // }
        return (
          <div className="container">
            <div className="row">
              <div className="input-field col s6">
                <i className="material-icons prefix">search</i>
                <input
                  id="icon_prefix"
                  type="text"
                  value={this.state.search}
                  onChange={this.handleSearchChange.bind(this)}
                />
                <label for="icon_prefix">
                  {this.state.search === '' ? 'Search Station Name' : ''}
                </label>
              </div>
            </div>
            <table className="striped z-depth-3" style={styles.tableStyle}>
              <thead>
                <tr>
                  <th className="flow-text center-align">Station Name:</th>
                  <th className="flow-text center-align">Division:</th>
                  <th className="flow-text center-align">Voltage (kV):</th>
                  <th className="flow-text center-align">Number of Calcs:</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {stations.map(e => {
                  return (
                    <tr>
                      <td className="center-align">{e.name}</td>
                      <td className="center-align">{e.division}</td>
                      <td className="center-align">{e.voltage}</td>
                      <td className="center-align">{e.stationCalcs.length}</td>
                      <td>
                        <Link
                          to={{
                            pathname: '/stationProfile',
                            state: { _id: e._id }
                          }}
                          className="waves-effect waves-light btn-small teal"
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
        );
      }
    }
  }

  render() {
    return <div className="row">{this.renderContent()}</div>;
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
  actions
)(Stations);
