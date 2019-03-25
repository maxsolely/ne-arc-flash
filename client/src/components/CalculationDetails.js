import React, { Component } from 'react';
import { Modal } from './common';
import { connect } from 'react-redux';
import * as actions from '../actions';

class CalculationDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calcParams: this.props.location.state.calculation.calcParams,
      results: this.props.location.state.calculation.results,
      calcID: this.props.location.state.calculation._id,
      showModal: false
    };
  }

  toggleModalFunction() {
    console.log('show modal triggered');
    console.log(this.state.showModal);
    this.setState({ showModal: !this.state.showModal });
  }

  deleteCalculation() {
    console.log('triggering delete 1584calc');
    this.props.delete1584Calc(this.props.auth.xauth, this.state.calcID);

    // <Redirect
    //       to={{ pathname: '/stationProfile', state: { _id: this.state.stationID } }}
    //     />
    this.setState({ showModal: !this.state.showModal });
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
          onConfirm={this.deleteCalculation.bind(this)}
          onConfirmButtonText="Delete Calculation"
        >
          <div class="row">
            Are you sure you want to delete this Calculation?
          </div>
        </Modal>
      );
    }
  }

  renderContent() {
    const {
      createdAt,
      sub,
      sub2,
      division,
      faultType,
      stationConfig,
      electrodeConfig,
      lineVoltage,
      boltedFaultCurrent,
      totalClearingTime,
      comments
    } = this.state.calcParams;

    const {
      incidentEnergy,
      calculatedArcFlashEnergy,
      hrcLevel
    } = this.state.results;

    return (
      <div className="container">
        <section
          className="section teal lighten-4 z-depth-2 col s12"
          style={styles.sectionStyle}
        >
          <div className="row">
            <h4 className="col s12" style={styles.headerStyle}>
              Params:
            </h4>
          </div>
          <div id="calcParamsContainer" style={{ padding: '0px 10px' }}>
            <div className="row">
              <p className="col s12 m6">Primary Substation: {sub}</p>
              <p className="col s12 m6">Remote Substation: {sub2}</p>
              <p className="col s12 m6">Division: {division}</p>
              <p className="col s12 m6">Fault Type: {faultType}</p>
              <p className="col s12 m6">Station Config: {stationConfig}</p>
              <p className="col s12 m6">Electrode Config: {electrodeConfig}</p>
              <p className="col s12 m6">Line Voltage: {lineVoltage}</p>
              <p className="col s12 m6">
                Bolted Fault Current: {boltedFaultCurrent}
              </p>
              <p className="col s12 m6">
                Total Clearing Time: {totalClearingTime}
              </p>
              <p className="col s12 m6">Comments: {comments}</p>
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
          <div id="calcResultsContainer" style={{ padding: '0px 10px' }}>
            <div className="row">
              <p className="col s12 m6">Incident Energy: {incidentEnergy}</p>
              <p className="col s12 m6">
                Calculated Arc Flash Energy: {calculatedArcFlashEnergy}
              </p>
              <p className="col s12 m6">HRC Level: {hrcLevel}</p>
              <button
                className="btn waves-effect waves-light btn-large col s4 offset-s4"
                onClick={this.toggleModalFunction.bind(this)}
              >
                Delete Calculation
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderModal()}
        {this.renderContent()}
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
    auth: state.auth
  };
}

export default connect(
  mapStateToProps,
  actions
)(CalculationDetails);
