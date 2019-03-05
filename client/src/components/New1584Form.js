import React, { Component } from 'react';
import { connect } from 'react-redux';
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
        grounded: false,
        lineVoltage: this.props.location.state.voltage,
        faultCurrent: Number,
        relayOpTime: Number,
        comment: ''
      },
      stationID: this.props.location.state._id,
      showModal: false
    };

    this.handleSub2NameChange = this.handleSub2NameChange.bind(this);
    this.handleGroundedChange = this.handleGroundedChange.bind(this);
    this.handleFaultCurrentChange = this.handleFaultCurrentChange.bind(this);
    this.handleRelayOpTimeChange = this.handleRelayOpTimeChange.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSub2NameChange(event) {
    const { calcParams } = this.state;
    calcParams.sub2 = event.target.value;
    console.log(this.state.calcParams.sub2);
    this.setState({ calcParams });
  }

  handleGroundedChange() {
    const { calcParams } = this.state;
    calcParams.grounded = !calcParams.grounded;
    console.log(this.state.calcParams.grounded);
    this.setState({ calcParams });
  }

  handleFaultCurrentChange(event) {
    const { calcParams } = this.state;
    calcParams.faultCurrent = event.target.value;
    console.log(this.state.calcParams.faultCurrent);
    this.setState({ calcParams });
  }

  handleRelayOpTimeChange(event) {
    const { calcParams } = this.state;
    calcParams.relayOpTime = event.target.value;
    console.log(this.state.calcParams.relayOpTime);
    this.setState({ calcParams });
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
    this.props.add1584Calc(this.props.auth.xauth, this.state.calcParams);
    // this.props.addStation(this.props.auth.xauth, this.state);
    // this.setState({ name: '', division: '', voltage: '', stationConfig: '' });
  }

  renderContent() {
    switch (this.props.auth._id) {
      case null:
        return;

      case false:
        return <h1>you need to be logged in</h1>;

      default:
        return (
          <form class="col s12" onSubmit={this.handleSubmit}>
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
                  onChange={this.handleSub2NameChange}
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
            <div class="switch">
              <label>
                Ungrounded
                <input type="checkbox" onClick={this.handleGroundedChange} />
                <span class="lever" />
                Grounded
              </label>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <input
                  id="faultCurrent"
                  placeholder="Fault Current (Amps)"
                  type="number"
                  min="0"
                  class="validate"
                  required
                  value={this.state.calcParams.faultCurrent}
                  onChange={this.handleFaultCurrentChange}
                />
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <input
                  id="relayOpTime"
                  placeholder="Relay Op Time (seconds)"
                  type="number"
                  min="0"
                  step="0.001"
                  class="validate"
                  required
                  value={this.state.calcParams.relayOpTime}
                  onChange={this.handleRelayOpTimeChange}
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
                  onChange={this.handleCommentChange}
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
    return <div class="row">{this.renderContent()}</div>;
  }
}

function mapStateToProps(state) {
  return { auth: state.auth, results1584: state.calculation1584 };
}

export default connect(
  mapStateToProps,
  actions
)(New1584Form);
