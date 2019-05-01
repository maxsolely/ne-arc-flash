import React, { Component } from 'react';
import { connect } from 'react-redux';
import { add1584Calc, delete1584Calc, resetErrorMessage } from '../actions';
import { Modal, LoginCard } from './common';

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

    this.handleCalcParamsDataChange = this.handleCalcParamsDataChange.bind(
      this
    );

    this.handleResultsDataChange = this.handleResultsDataChange.bind(this);
  }

  handleCalcParamsDataChange(prop, event) {
    const { calcParams } = this.state;
    calcParams[prop] = event.target.value;
    console.log(calcParams[prop]);
    this.setState({ calcParams });
  }

  handleResultsDataChange(prop, event) {
    const { results } = this.state;
    results[prop] = event.target.value;
    console.log(results[prop]);
    this.setState({ results });
  }

  showModalFunction() {
    console.log('show modal triggered');
    console.log(this.state.showModal);
    this.props.resetErrorMessage();
    this.setState({ showModal: !this.state.showModal });
  }

  deleteCalculation() {
    console.log('triggering delete 1584calc');
    this.props.resetErrorMessage();
    this.props.delete1584Calc(this.props.auth.xauth, this.props.calcID);
    this.setState({ showModal: !this.state.showModal });
  }

  triggerGoBack() {
    this.props.history.goBack();
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state);
    this.props.add1584Calc(this.props.auth.xauth, {
      calcParams: this.state.calcParams,
      results: this.state.results
    });
    this.setState({ showModal: !this.state.showModal });
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
          onCancelButtonText="Cancel"
          onConfirm={this.triggerGoBack.bind(this)}
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
          <div>
            <form className="col s12" onSubmit={this.handleSubmit.bind(this)}>
              <section
                className="section z-depth-2"
                style={{ margin: '10px 0', backgroundColor: '#F6F3E4' }}
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
                      <select
                        className="browser-default"
                        id="sub2"
                        onChange={event =>
                          this.handleCalcParamsDataChange('sub2', event)
                        }
                      >
                        <option value="" disabled selected>
                          Choose a Remote Substation
                        </option>
                        {this.props.stations.map(e => {
                          return <option value={e.name}>{e.name}</option>;
                        })}
                      </select>
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
                        onChange={event =>
                          this.handleCalcParamsDataChange(
                            'electrodeConfig',
                            event
                          )
                        }
                      >
                        <option value="" disabled selected>
                          Choose an Electrode Configuration
                        </option>
                        <option value="VCB ">
                          VCB (Vertical conductors/electrodes inside a metal
                          box/enclosure)
                        </option>
                        <option value="VCBB">
                          VCBB (Vertical conductors/electrodes terminated in an
                          insulating barrier inside a metal box)
                        </option>
                        <option value="HCB">
                          HCB (Horizontal conductors/electrodes inside a metal
                          box/enclosure)
                        </option>
                        <option value="VOA">
                          VOA (Vertical conductors/electrodes in open air)
                        </option>
                        <option value="HOA">
                          HOA (Horizontal conductors/electrodes in open air)
                        </option>
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
                        onChange={event =>
                          this.handleCalcParamsDataChange(
                            'boltedFaultCurrent',
                            event
                          )
                        }
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
                        onChange={event =>
                          this.handleCalcParamsDataChange(
                            'totalClearingTime',
                            event
                          )
                        }
                      />
                      <label for="totalClearingTime" className="active">
                        Total Clearing Time (relay op time + breaker
                        clearing)(seconds):
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              <section
                className="section z-depth-2"
                style={{ margin: '10px 0', backgroundColor: '#E4E7F6' }}
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
                        onChange={event =>
                          this.handleResultsDataChange('incidentEnergy', event)
                        }
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
                        onChange={event =>
                          this.handleResultsDataChange(
                            'calculatedArcFlashEnergy',
                            event
                          )
                        }
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
                        onChange={event =>
                          this.handleCalcParamsDataChange('comment', event)
                        }
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
    errorMessage: state.errorMessage,
    stations: state.stations.stationsArray
  };
}

export default connect(
  mapStateToProps,
  { add1584Calc, delete1584Calc, resetErrorMessage }
)(New1584Form);
