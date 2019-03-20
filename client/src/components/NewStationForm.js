import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actions from '../actions';
import { Modal, LoginCard } from './common';

class NewStationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      division: '',
      voltage: '',
      stationConfig: '',
      showModal: false,
      redirect: false
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
    this.setState({
      name: '',
      division: '',
      voltage: '',
      stationConfig: '',
      showModal: !this.state.showModal
    });
  }

  showModalFunction() {
    console.log('show modal triggered');
    console.log(this.state.showModal);
    this.props.resetErrorMessage();
    this.setState({ showModal: !this.state.showModal });
  }

  triggerRedirect() {
    this.setState({ redirect: !this.state.redirect });
  }
  renderRedirect() {
    if (this.state.redirect) {
      return <Redirect to="/stations" />;
    }
  }

  renderModal() {
    if (!this.state.showModal) {
      return null;
    } else {
      const modalContent = this.props.errorMessage ? (
        <div className="row">Error: {this.props.errorMessage}</div>
      ) : (
        <div>
          <div class="row">
            Successfully added {this.state.name} to the database!
          </div>
        </div>
      );

      return (
        <Modal
          modalTitle="Add Station Results"
          onCancel={this.showModalFunction.bind(this)}
          onCancelButtonText="Close"
          onConfirm={this.triggerRedirect.bind(this)}
          onConfirmButtonText="Go To Stations"
        >
          {modalContent}
        </Modal>
      );
    }
  }

  renderContent() {
    switch (this.props.auth._id) {
      case null:
        return;

      case false:
        return <LoginCard />;

      default:
        return (
          <div className="container">
            <form className="col s12" onSubmit={this.handleSubmit}>
              <section
                className="section amber lighten-4 z-depth-2"
                style={styles.sectionStyle}
              >
                <div className="row">
                  <h4 className="col s12" style={styles.headerStyle}>
                    Station Information:
                  </h4>
                </div>
                <div
                  id="newStationInputContainer"
                  style={{ padding: '0px 10px' }}
                >
                  <div className="row">
                    <div className="input-field col s12">
                      <input
                        id="stationName"
                        placeholder="Station Name"
                        type="text"
                        class="validate"
                        value={this.state.name}
                        onChange={this.handleStationNameChange}
                      />
                      <label for="stationName" className="active">
                        Station Name:
                      </label>
                      {/* <label for="station_name">Station Name</label> */}
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field col s12 m6">
                      <select
                        className="browser-default"
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
                  </div>
                  <div className="row">
                    <div className="input-field col s12" id="division">
                      <p className="col s6 m3">
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
                      <p className="col s6 m3">
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
                      <p className="col s6 m3">
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
                      <p className="col s6 m3">
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
                      <label for="division" className="active">
                        Division:
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field col s12" id="stationConfig">
                      <p className="col s6 m3">
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
                      <p className="col s6 m3">
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
                      <label for="stationConfig" className="active">
                        Station Config:
                      </label>
                    </div>
                  </div>
                  <input
                    className="btn waves-effect waves-light btn-large col s4 offset-s4"
                    style={{ zIndex: 0 }}
                    type="submit"
                    value="submit"
                  />
                </div>
              </section>
            </form>
          </div>
        );
    }
  }

  render() {
    return (
      <div class="row">
        {this.renderContent()}
        {this.renderModal()}
        {this.renderRedirect()}
      </div>
    );
  }
}

const styles = {
  sectionStyle: {
    margin: '10px 0'
  },
  headerStyle: {
    margin: '0',
    paddingLeft: '15px'
  }
};

function mapStateToProps(state) {
  return { auth: state.auth, errorMessage: state.errorMessage };
}

export default connect(
  mapStateToProps,
  actions
)(NewStationForm);
