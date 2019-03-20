import React, { Component } from 'react';
import { Modal, LoginCard } from './common';
import { connect } from 'react-redux';
// import { Redirect } from 'react-router-dom';
import * as actions from '../actions';

class New1584Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calcParams: {
        sub: this.props.location.state.name,
        sub2: '',
        division: this.props.location.state.division,
        faultType: '3 phase',
        stationConfig: this.props.location.state.stationConfig,
        electrodeConfig: '',
        lineVoltage: this.props.location.state.voltage,
        boltedFaultCurrent: Number,
        totalClearingTime: Number,
        comment: ''
      },
      results: {
        incidentEnergy: Number,
        calculatedArcFlashEnergy: Number
      },
      stationID: this.props.location.state._id,
      showModal: false
    };

    // this.showModalFunction = this.showModalFunction.bind(this);
    // this.handleSub2NameChange = this.handleSub2NameChange.bind(this);
    // this.handleFaultCurrentChange = this.handleFaultCurrentChange.bind(this);
    //this.handleTotalClearingTimeChange = this.handleTotalClearingTimeChange.bind(
    //  this
    // );
    // this.handleCommentChange = this.handleCommentChange.bind(this);
    // this.deleteCalculation = this.deleteCalculation.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  showModalFunction() {
    console.log('show modal triggered');
    console.log(this.state.showModal);
    this.setState({ showModal: !this.state.showModal });
  }

  deleteCalculation() {
    console.log('triggering delete 1584calc');
    this.props.delete1584Calc(this.props.auth.xauth, this.props.calcID);

    // <Redirect
    //       to={{ pathname: '/stationProfile', state: { _id: this.state.stationID } }}
    //     />
    this.setState({ showModal: !this.state.showModal });
  }

  handleSub2NameChange(event) {
    const { calcParams } = this.state;
    calcParams.sub2 = event.target.value;
    console.log(this.state.calcParams.sub2);
    this.setState({ calcParams });
  }

  handleElectrodeConfigChange(event) {
    const { calcParams } = this.state;
    calcParams.electrodeConfig = event.target.value;
    console.log(this.state.calcParams.electrodeConfig);
    this.setState({ calcParams });
  }

  handleBoltedFaultCurrentChange(event) {
    const { calcParams } = this.state;
    calcParams.boltedFaultCurrent = event.target.value;
    console.log(this.state.calcParams.boltedFaultCurrent);
    this.setState({ calcParams });
  }

  handleTotalClearingTimeChange(event) {
    const { calcParams } = this.state;
    calcParams.totalClearingTime = event.target.value;
    console.log(this.state.calcParams.totalClearingTime);
    this.setState({ calcParams });
  }

  handleIncidentEnergyChange(event) {
    const { results } = this.state;
    results.incidentEnergy = event.target.value;
    console.log(this.state.results.incidentEnergy);
    this.setState({ results });
  }

  handleArcFlashEnergyChange(event) {
    const { results } = this.state;
    results.calculatedArcFlashEnergy = event.target.value;
    console.log(this.state.results.calculatedArcFlashEnergy);
    this.setState({ results });
  }

  handleCommentChange(event) {
    const { calcParams } = this.state;
    calcParams.comment = event.target.value;
    console.log(this.state.calcParams.comment);
    this.setState({ calcParams });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state);
    this.props.add1584Calc(this.props.auth.xauth, {
      calcParams: this.state.calcParams,
      results: this.state.results
    });
    this.setState({ showModal: !this.state.showModal });
    // this.props.addStation(this.props.auth.xauth, this.state);
    // this.setState({ name: '', division: '', voltage: '', stationConfig: '' });
  }

  renderModal() {
    if (!this.state.showModal) {
      return null;
    } else {
      const {
        incidentEnergy,
        calculatedArcFlashEnergy,
        hrcLevel
      } = this.props.calcResults;

      const modalContent = this.props.errorMessage ? (
        <div className="row">Error: {this.props.errorMessage}</div>
      ) : (
        <div>
          <div class="row">
            Arc Current: {incidentEnergy || 'still rendering'}
          </div>
          <div class="row">
            Arc Flash Energy: {calculatedArcFlashEnergy || 'still rendering'}
          </div>
          <div class="row">HRC level: {hrcLevel || 'still rendering'}</div>
        </div>
      );

      return (
        <Modal
          modalTitle="Calculation Results"
          onCancel={this.deleteCalculation.bind(this)}
          onCancelButtonText="Discard Calculation"
          onConfirm={this.showModalFunction.bind(this)}
          onConfirmButtonText="Save Calculation"
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
            <form className="col s12" onSubmit={this.handleSubmit.bind(this)}>
              <section
                className="section teal lighten-4 z-depth-2"
                style={styles.sectionStyle}
              >
                <div className="row">
                  <h4 className="col s12" style={styles.headerStyle}>
                    Params:
                  </h4>
                </div>
                <div id="paramsInputContainer" style={{ padding: '0px 10px' }}>
                  <div className="row">
                    <div className="input-field col s12 m6">
                      <input
                        disabled
                        id="sub"
                        type="text"
                        className="validate"
                        required
                        value={this.state.calcParams.sub}
                      />
                      <label for="sub" className="active">
                        Primary Station:
                      </label>
                    </div>
                    <div className="input-field col s12 m6">
                      <input
                        id="sub2"
                        type="text"
                        required
                        value={this.state.calcParams.sub2}
                        onChange={this.handleSub2NameChange.bind(this)}
                      />
                      <label for="sub2" className="active">
                        Remote Substation:
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field col s12 m6">
                      <input
                        disabled
                        id="faultType"
                        type="text"
                        className="validate"
                        required
                        value={this.state.calcParams.faultType}
                      />
                      <label for="faultType" className="active">
                        Fault Type:
                      </label>
                    </div>
                    <div className="input-field col s12 m6">
                      <input
                        disabled
                        id="voltage"
                        type="text"
                        className="validate"
                        required
                        value={this.state.calcParams.lineVoltage}
                      />
                      <label for="voltage" className="active">
                        Voltage:
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field col s12 m6">
                      <input
                        disabled
                        id="stationConfig"
                        type="text"
                        className="validate"
                        required
                        value={this.state.calcParams.stationConfig}
                      />
                      <label for="stationConfig" className="active">
                        Station Config:
                      </label>
                    </div>
                    <div className="input-field col s12 m6">
                      <select
                        className="browser-default"
                        id="electrodeConfig"
                        onChange={this.handleElectrodeConfigChange.bind(this)}
                      >
                        <option value="" disabled selected>
                          Choose an Electrode Configuration
                        </option>
                        <option value="VCB ">VCB</option>
                        <option value="VCBB">VCBB</option>
                        <option value="HCB">HCB</option>
                        <option value="VOA">VOA</option>
                        <option value="HOA">HOA</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field col s12 m6">
                      <input
                        id="boltedFaultCurrent"
                        type="number"
                        min="0"
                        className="validate"
                        required
                        value={this.state.calcParams.boltedFaultCurrent}
                        onChange={this.handleBoltedFaultCurrentChange.bind(
                          this
                        )}
                      />
                      <label for="boltedFaultCurrent" className="active">
                        Bolted Fault Current (Amps):
                      </label>
                    </div>
                    <div className="input-field col s12 m6">
                      <input
                        id="totalClearingTime"
                        type="number"
                        min="0"
                        step="0.001"
                        className="validate"
                        required
                        value={this.state.calcParams.totalClearingTime}
                        onChange={this.handleTotalClearingTimeChange.bind(this)}
                      />
                      <label for="totalClearingTime" className="active">
                        Total Clearing Time (relay op time + breaker clearing):
                      </label>
                    </div>
                  </div>
                </div>
              </section>
              <section
                className="section amber lighten-4 z-depth-2"
                style={styles.sectionStyle}
              >
                <div className="row">
                  <h4 className="col s12" style={styles.headerStyle}>
                    Results:
                  </h4>
                </div>
                <div id="resultsInputContainer" style={{ padding: '0px 10px' }}>
                  <div className="row">
                    <div className="input-field col s12 m6">
                      <input
                        id="incidentEnergy"
                        type="number"
                        min="0"
                        step="0.01"
                        className="validate"
                        required
                        value={this.state.results.incidentEnergy}
                        onChange={this.handleIncidentEnergyChange.bind(this)}
                      />
                      <label for="incidentEnergy" className="active">
                        Incident Energy (0.00):
                      </label>
                    </div>
                    <div className="input-field col s12 m6">
                      <input
                        id="arcFlashEnergy"
                        type="number"
                        min="0"
                        step="0.01"
                        className="validate"
                        required
                        value={this.state.results.calculatedArcFlashEnergy}
                        onChange={this.handleArcFlashEnergyChange.bind(this)}
                      />
                      <label for="arcFlashEnergy" className="active">
                        Calculated Arc Flash Energy (0.00):
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field col s12">
                      <textarea
                        id="comment"
                        className="materialize-textarea"
                        placeholder="Add Comments Here"
                        value={this.state.calcParams.comment}
                        onChange={this.handleCommentChange.bind(this)}
                      />
                    </div>
                  </div>
                  <input
                    class="btn waves-effect waves-light btn-large col s4 offset-s4"
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
  return {
    auth: state.auth,
    calcResults: state.calculation1584.results || 'Still being calculated',
    calcID: state.calculation1584._id || 'Still being calculated',
    errorMessage: state.errorMessage
  };
}

export default connect(
  mapStateToProps,
  actions
)(New1584Form);
