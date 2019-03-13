import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { LoginCard } from './common';

class NewStationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      division: '',
      voltage: '',
      stationConfig: ''
    };

    this.handleStationConfigChange = this.handleStationConfigChange.bind(this);
    this.handleStationNameChange = this.handleStationNameChange.bind(this);
    this.handleDivisionChange = this.handleDivisionChange.bind(this);
    this.handleVoltageChange = this.handleVoltageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleStationConfigChange(event) {
    console.log(this.state.stationConfig);
    this.setState({ stationConfig: event.target.value });
  }

  handleStationNameChange(event) {
    console.log(this.state.name);
    this.setState({ name: event.target.value });
  }

  handleDivisionChange(event) {
    console.log(this.state.division);
    this.setState({ division: event.target.value });
  }

  handleVoltageChange(event) {
    console.log(this.state.voltage);
    this.setState({ voltage: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state);
    console.log(this.props.auth.xauth);
    this.props.addStation(this.props.auth.xauth, this.state);
    this.setState({ name: '', division: '', voltage: '', stationConfig: '' });
  }

  renderContent() {
    switch (this.props.auth._id) {
      case null:
        return;

      case false:
        return <LoginCard />;

      default:
        return (
          <form class="col s12" onSubmit={this.handleSubmit}>
            <div class="row">
              <div class="input-field col s12">
                <input
                  id="station_name"
                  placeholder="Station Name"
                  type="text"
                  class="validate"
                  value={this.state.name}
                  onChange={this.handleStationNameChange}
                />
                {/* <label for="station_name">Station Name</label> */}
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <p class="col s3">
                  <label>
                    <input
                      name="division"
                      type="radio"
                      value="Ocean State"
                      onClick={this.handleDivisionChange}
                    />
                    <span>Ocean State</span>
                  </label>
                </p>
                <p class="col s3">
                  <label>
                    <input
                      name="division"
                      type="radio"
                      value="Bay State West"
                      onClick={this.handleDivisionChange}
                    />
                    <span>Bay State West</span>
                  </label>
                </p>
                <p class="col s3">
                  <label>
                    <input
                      name="division"
                      type="radio"
                      value="Bay State South"
                      onClick={this.handleDivisionChange}
                    />
                    <span>Bay State South</span>
                  </label>
                </p>
                <p class="col s3">
                  <label>
                    <input
                      name="division"
                      type="radio"
                      value="North and Granite"
                      onClick={this.handleDivisionChange}
                    />
                    <span>North and Granite</span>
                  </label>
                </p>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s6">
                <select
                  class="browser-default"
                  onChange={this.handleVoltageChange}
                >
                  <option value="" disabled selected>
                    Choose a Voltage (kV)
                  </option>
                  <option value="4 kV">4</option>
                  <option value="13.8 kV">13.8</option>
                  <option value="34.5 kV">34.5</option>
                  <option value="69 kV">69</option>
                  <option value="115 kV">115</option>
                </select>
              </div>
              <div class="input-field col s3">
                <p>
                  <label>
                    <input
                      name="metal_or_open"
                      type="radio"
                      value="Metalclad"
                      onClick={this.handleStationConfigChange}
                    />
                    <span>Metalclad</span>
                  </label>
                </p>
              </div>
              <div class="input-field col s3">
                <p>
                  <label>
                    <input
                      name="metal_or_open"
                      type="radio"
                      value="Open-Air"
                      onClick={this.handleStationConfigChange}
                    />
                    <span>Open-Air</span>
                  </label>
                </p>
              </div>
            </div>
            <input
              class="btn waves-effect waves-light btn-large"
              type="submit"
              value="submit"
            />
          </form>
        );
    }
  }

  render() {
    return <div class="row">{this.renderContent()}</div>;
  }
}

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(
  mapStateToProps,
  actions
)(NewStationForm);
