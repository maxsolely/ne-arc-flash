import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state.email, this.state.password);
    this.props.loginUser(this.state.email, this.state.password);
    this.setState({ email: '', password: '' });
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label id="email">
          Email:
          <input
            type="text"
            value={this.state.email}
            onChange={this.handleEmailChange}
          />
        </label>
        <label id="password">
          Password:
          <input
            type="password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
          />
        </label>
        <input type="submit" value="submit" />
      </form>
    );
  }
}

export default connect(
  null,
  actions
)(LoginForm);
