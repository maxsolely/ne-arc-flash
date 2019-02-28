import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { Link } from 'react-router-dom';

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

  // componentDidMount() {
  //   this.props.fetchUser(this.props.auth.xauth);
  // }

  renderContent() {
    switch (this.props.auth._id) {
      case null:
        return;

      case false:
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

      default:
        return (
          <div>
            <h1> you are logged in as {this.props.auth.email}</h1>
            <Link to="/dashboard">Go to dashboard</Link>
          </div>
        );
    }
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(
  mapStateToProps,
  actions
)(LoginForm);
