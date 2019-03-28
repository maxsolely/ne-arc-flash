import React, { Component } from 'react';
import { Modal, LoginCard } from './common';
import { connect } from 'react-redux';
import { addArcProCalc, deleteArcProCalc, resetErrorMessage } from '../actions';

class NewArcProForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calcParams: {
        sub: this.props.location.state.name,
        sub2: '',
        division: this.props.location.state.division,
        faultType: '',
        stationConfig: this.props.location.state.stationConfig,
        grounded: true,
        lineVoltage: this.props.location.state.voltage,
        faultCurrent: Number,
        relayOpTime: Number,
        comment: ''
      },
      arcProInput: {
        current: Number,
        sourceVoltage: parseFloat(this.props.location.state.voltage) * 1000,
        duration: Number,
        electrodeMaterial: '',
        arcGap: Number,
        distanceToArc: Number
      },
      arcProResults: {
        arcVoltage: Number,
        arcEnergy: Number,
        heatFluxAtCircleR: Number,
        heatFluxAtCircleZ: Number,
        maxHeatFlux: Number,
        flux: Number
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

    this.handleArcProInputDataChange = this.handleArcProInputDataChange.bind(
      this
    );

    this.handleArcProResultsDataChange = this.handleArcProResultsDataChange.bind(
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

  handleArcProInputDataChange(prop, event) {
    const { arcProInput } = this.state;
    arcProInput[prop] = event.target.value;
    console.log(arcProInput[prop]);
    this.setState({ arcProInput });
  }

  handleArcProResultsDataChange(prop, event) {
    const { arcProResults } = this.state;
    arcProResults[prop] = event.target.value;
    console.log(arcProResults[prop]);
    this.setState({ arcProResults });
  }

  handleResultsDataChange(prop, event) {
    const { results } = this.state;
    results[prop] = event.target.value;
    console.log(results[prop]);
    this.setState({ results });
  }

  triggerGoBack() {
    this.props.history.goBack();
  }

  showModalFunction() {
    console.log('show modal triggered');
    console.log(this.state.showModal);
    this.props.resetErrorMessage();
    this.setState({ showModal: !this.state.showModal });
  }

  deleteCalculation() {
    console.log('triggering delete arcProCalc');
    this.props.resetErrorMessage();
    this.props.deleteArcProCalc(this.props.auth.xauth, this.props.calcID);
    this.setState({ showModal: !this.state.showModal });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state);
    this.props.addArcProCalc(this.props.auth.xauth, {
      calcParams: this.state.calcParams,
      arcProInput: this.state.arcProInput,
      arcProResults: this.state.arcProResults,
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
          <div className="container">
            <h1>Arc Pro</h1>
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
                  </div>
                  <div className="row">
                    <div className="input-field col s12 m6" id="faultType">
                      <p className="col s6 m6">
                        <label>
                          <input
                            name="faultType"
                            type="radio"
                            value="1 phase"
                            onClick={event =>
                              this.handleCalcParamsDataChange(
                                'faultType',
                                event
                              )
                            }
                          />
                          <span>1 phase</span>
                        </label>
                      </p>
                      <p className="col s6 m6">
                        <label>
                          <input
                            name="faultType"
                            type="radio"
                            value="3 phase"
                            onClick={event =>
                              this.handleCalcParamsDataChange(
                                'faultType',
                                event
                              )
                            }
                          />
                          <span>3 phase</span>
                        </label>
                      </p>
                      <label for="faultType" className="active">
                        Fault Type:
                      </label>
                    </div>
                    <div className="input-field col s12 m6" id="grounded">
                      <p className="col s6 m6">
                        <label>
                          <input
                            name="grounded"
                            type="radio"
                            value={true}
                            onClick={event =>
                              this.handleCalcParamsDataChange('grounded', event)
                            }
                          />
                          <span>true</span>
                        </label>
                      </p>
                      <p className="col s6 m6">
                        <label>
                          <input
                            name="grounded"
                            type="radio"
                            value={false}
                            onClick={event =>
                              this.handleCalcParamsDataChange('grounded', event)
                            }
                          />
                          <span>false</span>
                        </label>
                      </p>
                      <label for="grounded" className="active">
                        Grounding:
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field col s12 m6">
                      <input
                        id="faultCurrent"
                        type="number"
                        min="0"
                        className="validate"
                        required
                        value={this.state.calcParams.faultCurrent}
                        onChange={event =>
                          this.handleCalcParamsDataChange('faultCurrent', event)
                        }
                      />
                      <label for="faultCurrent" className="active">
                        Fault Current (Amps):
                      </label>
                    </div>
                    <div className="input-field col s12 m6">
                      <input
                        id="relayOpTime"
                        type="number"
                        min="0"
                        step="0.001"
                        className="validate"
                        required
                        value={this.state.calcParams.relayOpTime}
                        onChange={event =>
                          this.handleCalcParamsDataChange('relayOpTime', event)
                        }
                      />
                      <label for="relayOpTime" className="active">
                        Relay Operation Time:
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              <section
                className="section indigo lighten-4 z-depth-2"
                style={styles.sectionStyle}
              >
                <div className="row">
                  <h4 className="col s12" style={styles.headerStyle}>
                    Arc Pro Input:
                  </h4>
                </div>
                <div id="arcProInputContainer" style={{ padding: '0px 10px' }}>
                  <div className="row">
                    <div className="input-field col s12 m6">
                      <input
                        id="current"
                        type="number"
                        min="0"
                        className="validate"
                        required
                        value={this.state.arcProInput.current}
                        onChange={event =>
                          this.handleArcProInputDataChange('current', event)
                        }
                      />
                      <label for="current" className="active">
                        Current (kA):
                      </label>
                    </div>
                    <div className="input-field col s12 m6">
                      <input
                        disabled
                        id="sourceVoltage"
                        type="text"
                        className="validate"
                        required
                        value={this.state.arcProInput.sourceVoltage}
                      />
                      <label for="sourceVoltage" className="active">
                        Source Voltage:
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field col s12 m6">
                      <input
                        id="duration"
                        type="number"
                        min="0"
                        step="0.01"
                        className="validate"
                        required
                        value={this.state.arcProInput.duration}
                        onChange={event =>
                          this.handleArcProInputDataChange('duration', event)
                        }
                      />
                      <label for="duration" className="active">
                        Duration (cycles):
                      </label>
                    </div>
                    <div
                      className="input-field col s12 m6"
                      id="electrodeMaterial"
                    >
                      <p className="col s6 m6">
                        <label>
                          <input
                            name="electrodeMaterial"
                            type="radio"
                            value="Copper"
                            onClick={event =>
                              this.handleArcProInputDataChange(
                                'electrodeMaterial',
                                event
                              )
                            }
                          />
                          <span>Copper</span>
                        </label>
                      </p>
                      <p className="col s6 m6">
                        <label>
                          <input
                            name="electrodeMaterial"
                            type="radio"
                            value="Stainless Steel"
                            onClick={event =>
                              this.handleArcProInputDataChange(
                                'electrodeMaterial',
                                event
                              )
                            }
                          />
                          <span>Stainless Steel</span>
                        </label>
                      </p>
                      <label for="electrodeMaterial" className="active">
                        Electrode Material:
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field col s12 m6">
                      <input
                        id="arcGap"
                        type="number"
                        min="0"
                        step="0.01"
                        className="validate"
                        required
                        value={this.state.arcProInput.arcGap}
                        onChange={event =>
                          this.handleArcProInputDataChange('arcGap', event)
                        }
                      />
                      <label for="arcGap" className="active">
                        Arc Gap (inches):
                      </label>
                    </div>
                    <div className="input-field col s12 m6">
                      <input
                        id="distanceToArc"
                        type="number"
                        min="0"
                        step="0.01"
                        className="validate"
                        required
                        value={this.state.arcProInput.distanceToArc}
                        onChange={event =>
                          this.handleArcProInputDataChange(
                            'distanceToArc',
                            event
                          )
                        }
                      />
                      <label for="distanceToArc" className="active">
                        Distance to Arc (inches):
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              <section
                className="section red lighten-4 z-depth-2"
                style={styles.sectionStyle}
              >
                <div className="row">
                  <h4 className="col s12" style={styles.headerStyle}>
                    Arc Pro Results:
                  </h4>
                </div>
                <div
                  id="arcProResultsInputContainer"
                  style={{ padding: '0px 10px' }}
                >
                  <div className="row">
                    <div className="input-field col s12 m6">
                      <input
                        id="arcVoltage"
                        type="number"
                        min="0"
                        className="validate"
                        required
                        value={this.state.arcProResults.arcVoltage}
                        onChange={event =>
                          this.handleArcProResultsDataChange(
                            'arcVoltage',
                            event
                          )
                        }
                      />
                      <label for="arcVoltage" className="active">
                        Arc Voltage (Volts):
                      </label>
                    </div>
                    <div className="input-field col s12 m6">
                      <input
                        id="arcEnergy"
                        type="number"
                        min="0"
                        className="validate"
                        required
                        value={this.state.arcProResults.arcEnergy}
                        onChange={event =>
                          this.handleArcProResultsDataChange('arcEnergy', event)
                        }
                      />
                      <label for="arcEnergy" className="active">
                        Arc Energy (kcal):
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field col s12 m6">
                      <input
                        id="heatFluxAtCircleR"
                        type="number"
                        min="0"
                        step="0.1"
                        className="validate"
                        required
                        value={this.state.arcProResults.heatFluxAtCircleR}
                        onChange={event =>
                          this.handleArcProResultsDataChange(
                            'heatFluxAtCircleR',
                            event
                          )
                        }
                      />
                      <label for="heatFluxAtCircleR" className="active">
                        Heat Flux at Circle R (in):
                      </label>
                    </div>
                    <div className="input-field col s12 m6">
                      <input
                        id="heatFluxAtCircleZ"
                        type="number"
                        min="0"
                        step="0.1"
                        className="validate"
                        required
                        value={this.state.arcProResults.heatFluxAtCircleZ}
                        onChange={event =>
                          this.handleArcProResultsDataChange(
                            'heatFluxAtCircleZ',
                            event
                          )
                        }
                      />
                      <label for="heatFluxAtCircleZ" className="active">
                        Heat Flux at Circle Z (in):
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field col s12 m6">
                      <input
                        id="maxHeatFlux"
                        type="number"
                        min="0"
                        className="validate"
                        required
                        value={this.state.arcProResults.maxHeatFlux}
                        onChange={event =>
                          this.handleArcProResultsDataChange(
                            'maxHeatFlux',
                            event
                          )
                        }
                      />
                      <label for="maxHeatFlux" className="active">
                        Maximum Heat Flux (cal/s/cm^2):
                      </label>
                    </div>
                    <div className="input-field col s12 m6">
                      <input
                        id="flux"
                        type="number"
                        min="0"
                        step="0.1"
                        className="validate"
                        required
                        value={this.state.arcProResults.flux}
                        onChange={event =>
                          this.handleArcProResultsDataChange('flux', event)
                        }
                      />
                      <label for="flux" className="active">
                        Flux (cal/s/cm^2):
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
    calcResults: state.arcProCalculation.results || 'Still being calculated',
    calcID: state.arcProCalculation._id || 'Still being calculated',
    errorMessage: state.errorMessage,
    stations: state.stations.stationsArray
  };
}

export default connect(
  mapStateToProps,
  { addArcProCalc, deleteArcProCalc, resetErrorMessage }
)(NewArcProForm);
