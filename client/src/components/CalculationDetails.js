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

  render() {
    return (
      <div>
        {this.renderModal()}
        <h4>Calculation Params:</h4>
        {Object.keys(this.state.calcParams).map(key => {
          return (
            <p>
              {key}: {this.state.calcParams[key]}
            </p>
          );
        })}
        <h4>Calculation Results:</h4>
        {Object.keys(this.state.results).map(key => {
          return (
            <p>
              {key}: {this.state.results[key]}
            </p>
          );
        })}
        <button
          className="waves-effect waves-light btn-small"
          onClick={this.toggleModalFunction.bind(this)}
        >
          Delete Calculation
        </button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default connect(
  mapStateToProps,
  actions
)(CalculationDetails);
