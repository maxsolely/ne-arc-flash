import React, { Component } from 'react';
import { Modal } from './common';
import { connect } from 'react-redux';
import { deleteArcProCalc } from '../actions';

class CalculationArcProDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calcParams: this.props.location.state.calculation.calcParams,
      arcProInput: this.props.location.state.calculation.arcProInput,
      arcProResults: this.props.location.state.calculation.arcProResults,
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
    this.props.deleteArcProCalc(this.props.auth.xauth, this.state.calcID);
    this.props.history.goBack();
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
      lineVoltage,
      faultCurrent,
      relayOpTime,
      grounded,
      comments
    } = this.state.calcParams;

    const {
      current,
      sourceVoltage,
      duration,
      electrodeMaterial,
      arcGap,
      distanceToArc
    } = this.state.arcProInput;
    const {
      arcVoltage,
      arcEnergy,
      maxHeatFlux,
      heatFluxAtCircleR,
      heatFluxAtCircleZ,
      flux
    } = this.state.arcProResults;
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
              <p className="col s12 m6">Grounding: {grounded}</p>
              <p className="col s12 m6">Line Voltage: {lineVoltage}</p>
              <p className="col s12 m6">Fault Current: {faultCurrent}</p>
              <p className="col s12 m6">Relay Operating Time: {relayOpTime}</p>
              <p className="col s12 m6">Comments: {comments}</p>
            </div>
          </div>
        </section>

        <section
          className="section indigo lighten-4 z-depth-2 col s12"
          style={styles.sectionStyle}
        >
          <div className="row">
            <h4 className="col s12" style={styles.headerStyle}>
              Arc Pro Input:
            </h4>
          </div>
          <div id="calcParamsContainer" style={{ padding: '0px 10px' }}>
            <div className="row">
              <p className="col s12 m6">Current: {current}</p>
              <p className="col s12 m6">Source Voltage: {sourceVoltage}</p>
              <p className="col s12 m6">Duration: {duration}</p>
              <p className="col s12 m6">
                Electrode Material: {electrodeMaterial}
              </p>
              <p className="col s12 m6">Arc Gap: {arcGap}</p>
              <p className="col s12 m6">Distance To Arc: {distanceToArc}</p>
            </div>
          </div>
        </section>

        <section
          className="section red lighten-4 z-depth-2 col s12"
          style={styles.sectionStyle}
        >
          <div className="row">
            <h4 className="col s12" style={styles.headerStyle}>
              Arc Pro Results:
            </h4>
          </div>
          <div id="calcParamsContainer" style={{ padding: '0px 10px' }}>
            <div className="row">
              <p className="col s12 m6">Arc Voltage: {arcVoltage}</p>
              <p className="col s12 m6">Arc Energy: {arcEnergy}</p>
              <p className="col s12 m6">Max Heat Flux: {maxHeatFlux}</p>
              <p className="col s12 m6">
                Heat Flux at Circle R: {heatFluxAtCircleR}
              </p>
              <p className="col s12 m6">
                Heat Flux at Circle Z: {heatFluxAtCircleZ}
              </p>
              <p className="col s12 m6">Flux: {flux}</p>
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
              <span
                className="btn waves-effect waves-light btn-large col s4 offset-s4"
                style={{ position: 'initial' }}
                onClick={this.toggleModalFunction.bind(this)}
              >
                Delete Calculation
              </span>
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
  { deleteArcProCalc }
)(CalculationArcProDetails);
