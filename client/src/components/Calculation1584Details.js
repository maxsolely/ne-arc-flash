import React, { Component } from 'react';
import { Modal } from './common';
import { connect } from 'react-redux';
import { delete1584Calc } from '../actions';

class Calculation1584Details extends Component {
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
    this.props.history.goBack();
    // <Redirect
    //       to={{ pathname: '/stationProfile', state: { _id: this.state.stationID } }}
    //     />
    // this.setState({ showModal: !this.state.showModal });
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
    const resultsArray = this.createArray(this.state.results);

    return (
      <div style={{ margin: '15px' }}>
        <section
          className="section z-depth-1 col s12"
          style={{ margin: '10px 0px', backgroundColor: '#F6F3E4' }}
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
                if (element[0] === 'Bolted Fault Current') unit = 'Amps';
                if (element[0] === 'Total Clearing Time') unit = 'seconds';
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
          className="section z-depth-1"
          style={{ margin: '10px 0px', backgroundColor: '#E4E7F6' }}
          // style={{ margin: '10px 0px', backgroundColor: '#E4F6F3' }}
          // style={{ margin: '10px 0px', backgroundColor: '#F3E4F6' }}
        >
          <div className="row">
            <h4 className="col s12" style={styles.headerStyle}>
              Results:
            </h4>
          </div>
          <div id="calcResultsContainer" style={{ padding: '0px' }}>
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
  { delete1584Calc }
)(Calculation1584Details);
