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
    this.props.deleteArcProCalc(
      this.props.auth.xauth,
      this.props.auth.role,
      this.state.calcID
    );
    this.props.history.goBack();
  }

  renderModal() {
    if (!this.state.showModal) {
      return null;
    } else {
      const modalContent =
        this.props.auth.role === 'Read' ? (
          <div className="row">
            Error: You do not have permission to perform this action.
          </div>
        ) : (
          <div>
            <div class="row">
              Are you sure you want to delete this Calculation?
            </div>
          </div>
        );
      return (
        <Modal
          modalTitle="Confirm Deletion"
          onCancel={this.toggleModalFunction.bind(this)}
          onCancelButtonText="Nevermind"
          onConfirm={this.deleteCalculation.bind(this)}
          onConfirmButtonText="Delete Calculation"
        >
          <div class="row">{modalContent}</div>
        </Modal>
      );
    }
  }

  createArray(object) {
    let objectArray = Object.keys(object).map(key => {
      let formattedKey = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, function(str) {
          return str.toUpperCase();
        });
      if (formattedKey === 'Created At')
        object[key] = new Date(object[key]).toString().slice(0, 15);
      if (formattedKey === 'Sub') formattedKey = 'Primary Substation';
      if (formattedKey === 'Sub2') formattedKey = 'Remote Substation';
      return [formattedKey, object[key]];
    });
    return objectArray;
  }

  createFields(array) {
    array.map(element => {
      return (
        <p className="col s12 m6">
          <span>{element[0]}</span>
          <span>{element[1]}</span>
        </p>
      );
    });
  }

  renderContent() {
    const calcParamsArray = this.createArray(this.state.calcParams);
    const arcProInputArray = this.createArray(this.state.arcProInput);
    const arcProResultsArray = this.createArray(this.state.arcProResults);
    const resultsArray = this.createArray(this.state.results);

    return (
      <div style={{ margin: '15px' }}>
        <section
          className="section z-depth-1 col s12"
          style={{ margin: '10px 0', backgroundColor: '#F6F3E4' }}
        >
          <div className="row">
            <h4 className="col s12" style={styles.headerStyle}>
              Params:
            </h4>
          </div>
          <div id="calcParamsContainer" style={{ padding: '0px 10px' }}>
            <div className="row" style={{ borderTop: '1px solid' }}>
              {calcParamsArray.map(element => {
                let unit;
                if (element[0] === 'Fault Current') unit = 'Amps';
                if (element[0] === 'Relay Op Time') unit = 'seconds';
                return (
                  <p className="col s12 m6">
                    <span style={styles.elementContainer}>
                      <span style={styles.elementName}>{element[0]}: </span>
                      <span>
                        {element[1]} {unit}
                      </span>
                    </span>
                  </p>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="section z-depth-1 col s12"
          style={{ margin: '10px 0', backgroundColor: '#E4E7F6' }}
        >
          <div className="row">
            <h4 className="col s12" style={styles.headerStyle}>
              Arc Pro Input:
            </h4>
          </div>
          <div id="calcParamsContainer" style={{ padding: '0px 10px' }}>
            <div className="row" style={{ borderTop: '1px solid' }}>
              {arcProInputArray.map(element => {
                let unit;
                switch (element[0]) {
                  case 'Current':
                    unit = 'kAmps';
                    break;
                  case 'Source Voltage':
                    unit = 'Volts';
                    break;
                  case 'Duration':
                    unit = 'cycles';
                    break;
                  case 'Arc Gap':
                    unit = 'inches';
                    break;
                  case 'Distance To Arc':
                    unit = 'inches';
                    break;
                  default:
                    unit = '';
                }
                return (
                  <p className="col s12 m6">
                    <span style={styles.elementContainer}>
                      <span style={styles.elementName}>{element[0]}: </span>
                      <span>
                        {element[1]} {unit}
                      </span>
                    </span>
                  </p>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="section z-depth-1 col s12"
          style={{ margin: '10px 0', backgroundColor: '#E4F5F6' }}
        >
          <div className="row">
            <h4 className="col s12" style={styles.headerStyle}>
              Arc Pro Results:
            </h4>
          </div>
          <div id="calcParamsContainer" style={{ padding: '0px 10px' }}>
            <div className="row" style={{ borderTop: '1px solid' }}>
              {arcProResultsArray.map(element => {
                let unit;
                switch (element[0]) {
                  case 'Arc Voltage':
                    unit = 'Volts';
                    break;
                  case 'Arc Energy':
                    unit = 'kcal';
                    break;
                  case 'Max Heat Flux':
                    unit = 'cal/s/cm2';
                    break;
                  case 'Flux':
                    unit = 'cal/s/cm2';
                    break;
                  case 'Heat Flux At Circle R':
                    unit = 'inches';
                    break;
                  case 'Heat Flux At Circle Z':
                    unit = 'inches';
                    break;
                  default:
                    unit = '';
                }
                return (
                  <p className="col s12 m6">
                    <span style={styles.elementContainer}>
                      <span style={styles.elementName}>{element[0]}: </span>
                      <span>
                        {element[1]} {unit}
                      </span>
                    </span>
                  </p>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="section z-depth-1 col s12"
          style={{ margin: '10px 0', backgroundColor: '#F6E5E4' }}
        >
          <div className="row">
            <h4 className="col s12" style={styles.headerStyle}>
              Results:
            </h4>
          </div>
          <div id="calcResultsContainer" style={{ padding: '0px 10px' }}>
            <div className="row" style={{ borderTop: '1px solid' }}>
              {resultsArray.map(element => {
                let unit;
                if (element[0] === 'Incident Energy') unit = 'J/cm2';
                if (element[0] === 'Calculated Arc Flash Energy')
                  unit = 'cal/cm2';
                return (
                  <p className="col s12 m6">
                    <span style={styles.elementContainer}>
                      <span style={styles.elementName}>{element[0]}: </span>
                      <span>
                        {element[1]} {unit}
                      </span>
                    </span>
                  </p>
                );
              })}
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
  headerStyle: {
    margin: '0',
    paddingLeft: '15px'
  },
  elementContainer: {
    padding: '12px 6px',
    borderRadius: '5px',
    fontSize: '20px'
  },
  elementName: {
    color: 'black',
    fontWeight: '600'
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
