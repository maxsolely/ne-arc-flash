import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { editStation, deleteStation, resetErrorMessage } from '../actions';
import { Modal, LoginCard } from './common';

class EditStationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.location.state._id,
      name: this.props.location.state.name,
      division: this.props.location.state.division,
      voltage: this.props.location.state.voltage,
      stationConfig: this.props.location.state.stationConfig,
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
    const { name, division, voltage, stationConfig, _id } = this.state;
    event.preventDefault();
    this.props.editStation(
      this.props.auth.xauth,
      { name, division, voltage, stationConfig },
      _id
    );
    this.props.history.goBack();
    // this.setState({
    //   name: '',
    //   division: '',
    //   voltage: '',
    //   stationConfig: '',
    //   showModal: !this.state.showModal
    // });
  }

  toggleModalFunction() {
    console.log('show modal triggered');
    console.log(this.state.showModal);
    this.setState({ showModal: !this.state.showModal });
  }

  deleteStation() {
    this.props.deleteStation(this.props.auth.xauth, this.state._id);
    this.triggerRedirect();
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
      return (
        <Modal
          modalTitle="Confirm Deletion"
          onCancel={this.toggleModalFunction.bind(this)}
          onCancelButtonText="Nevermind"
          onConfirm={this.deleteStation.bind(this)}
          onConfirmButtonText="Delete Station"
        >
          <div class="row">Are you sure you want to delete this Station?</div>
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
          <div>
            <form className="col s12" onSubmit={this.handleSubmit}>
              <section
                className="section z-depth-2"
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
                        id="voltage"
                        className="browser-default"
                        onChange={this.handleVoltageChange}
                        value={this.state.voltage}
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
                      <label for="voltage" className="active">
                        Voltage:
                      </label>
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
                            checked={this.state.division === 'Ocean State'}
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
                            checked={this.state.division === 'Bay State West'}
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
                            checked={this.state.division === 'Bay State South'}
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
                            checked={
                              this.state.division === 'North and Granite'
                            }
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
                            checked={this.state.stationConfig === 'Metalclad'}
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
                            checked={this.state.stationConfig === 'Open-Air'}
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
                    className="btn waves-effect waves-light btn-large col s5  m4 offset-m1"
                    style={{ zIndex: 0 }}
                    type="submit"
                    value="save changes"
                  />
                  <span
                    className="btn waves-effect waves-light btn-large col s5 offset-s2 m4 offset-m2"
                    style={{ position: 'initial' }}
                    onClick={this.toggleModalFunction.bind(this)}
                  >
                    Delete Station
                  </span>
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
    margin: '10px 0',
    backgroundColor: '#F6F3E4'
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
  { editStation, deleteStation, resetErrorMessage }
)(EditStationForm);
