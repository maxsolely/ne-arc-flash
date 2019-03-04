import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class New1584Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stationID: this.props.location.state._id,
      division: this.props.location.state.division,
      faultType: '3 phase',
      substation1: this.props.location.state.name,
      voltage: this.props.location.state.voltage,
      stationConfig: this.props.location.state.stationConfig,
      substation2: '',
      grounded: false,
      faultCurrent: null,
      relayOpTime: null,
      comment: ''
    };

    this.handleSub2NameChange = this.handleSub2NameChange.bind(this);
    this.handleGroundedChange = this.handleGroundedChange.bind(this);
    this.handleFaultCurrentChange = this.handleFaultCurrentChange.bind(this);
    this.handleRelayOpTimeChange = this.handleRelayOpTimeChange.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSub2NameChange(event) {
    console.log(this.state.substation2);
    this.setState({ substation2: event.target.value });
  }

  handleGroundedChange() {
    console.log(this.state.grounded);
    this.setState({ grounded: !this.state.grounded });
  }

  handleFaultCurrentChange(event) {
    console.log(this.state.faultCurrent);
    this.setState({ faultCurrent: event.target.value });
  }

  handleRelayOpTimeChange(event) {
    console.log(this.state.relayOpTime);
    this.setState({ relayOpTime: event.target.value });
  }

  handleCommentChange(event) {
    console.log(this.state.comment);
    this.setState({ comment: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state);
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
                  id="substation1"
                  type="text"
                  class="validate"
                  value={this.state.substation1}
                />
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <input
                  id="substation2"
                  placeholder="Substation 2"
                  type="text"
                  class="validate"
                  value={this.state.substation2}
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
                  value={this.state.faultType}
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
                  value={this.state.voltage}
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
                  value={this.state.stationConfig}
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
                  value={this.state.faultCurrent}
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
                  class="validate"
                  value={this.state.relayOpTime}
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
                  value={this.state.comment}
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
  return { auth: state.auth };
}

export default connect(
  mapStateToProps,
  actions
)(New1584Form);
