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
      return (
        <Modal
          modalTitle="Calculation Results"
          onCancel={this.deleteCalculation.bind(this)}
          onCancelButtonText="Discard Calculation"
          onConfirm={this.showModalFunction.bind(this)}
          onConfirmButtonText="Save Calculation"
        >
          <div class="row">
            Arc Current: {incidentEnergy || 'still rendering'}
          </div>
          <div class="row">
            Arc Flash Energy:{' '}
            {calculatedArcFlashEnergy || 'clearly did not work'}
          </div>
          <div class="row">HRC level: {hrcLevel || 'im an idiot'}</div>
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
          <form class="col s12" onSubmit={this.handleSubmit.bind(this)}>
            <div class="row">
              <div class="input-field col s12">
                <input
                  disabled
                  id="sub"
                  type="text"
                  class="validate"
                  required
                  value={this.state.calcParams.sub}
                />
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <input
                  id="sub2"
                  placeholder="Substation 2"
                  type="text"
                  class="validate"
                  required
                  value={this.state.calcParams.sub2}
                  onChange={this.handleSub2NameChange.bind(this)}
                />
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <input
                  disabled
                  id="faultType"
                  type="text"
                  class="validate"
                  required
                  value={this.state.calcParams.faultType}
                />
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <input
                  disabled
                  id="voltage"
                  type="text"
                  class="validate"
                  required
                  value={this.state.calcParams.lineVoltage}
                />
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <input
                  disabled
                  id="stationConfig"
                  type="text"
                  class="validate"
                  required
                  value={this.state.calcParams.stationConfig}
                />
              </div>
            </div>
            <div class="row">
              <div class="input-field col s6">
                <select
                  class="browser-default"
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
            {/* <div class="switch">
              <label>
                Ungrounded
                <input type="checkbox" onClick={this.handleGroundedChange} />
                <span class="lever" />
                Grounded
              </label>
            </div> */}
            <div class="row">
              <div class="input-field col s12">
                <input
                  id="boltedFaultCurrent"
                  placeholder="Bolted Fault Current (Amps)"
                  type="number"
                  min="0"
                  class="validate"
                  required
                  value={this.state.calcParams.boltedFaultCurrent}
                  onChange={this.handleBoltedFaultCurrentChange.bind(this)}
                />
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <input
                  id="totalClearingTime"
                  placeholder="Total Clearing Time (seconds)"
                  type="number"
                  min="0"
                  step="0.001"
                  class="validate"
                  required
                  value={this.state.calcParams.totalClearingTime}
                  onChange={this.handleTotalClearingTimeChange.bind(this)}
                />
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <input
                  id="incidentEnergy"
                  placeholder="Incident Energy"
                  type="number"
                  min="0"
                  step="0.01"
                  class="validate"
                  required
                  value={this.state.results.incidentEnergy}
                  onChange={this.handleIncidentEnergyChange.bind(this)}
                />
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <input
                  id="arcFlashEnergy"
                  placeholder="Calculated Arc Flash Energy"
                  type="number"
                  min="0"
                  step="0.01"
                  class="validate"
                  required
                  value={this.state.results.calculatedArcFlashEnergy}
                  onChange={this.handleArcFlashEnergyChange.bind(this)}
                />
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <textarea
                  id="comment"
                  class="materialize-textarea"
                  placeholder="Add Comments Here"
                  value={this.state.calcParams.comment}
                  onChange={this.handleCommentChange.bind(this)}
                />
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
    return (
      <div class="row">
        {this.renderContent()}
        {this.renderModal()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
    calcResults: state.calculation1584.results || 'Still being calculated',
    calcID: state.calculation1584._id || 'Still being calculated'
  };
}

export default connect(
  mapStateToProps,
  actions
)(New1584Form);
