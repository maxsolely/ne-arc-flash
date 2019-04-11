import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginUser } from '../actions';
import { Redirect } from 'react-router-dom';

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
          <div className="row">
            <form
              className="col m6 s10 offset-m3 offset-s1 z-depth-1"
              onSubmit={this.handleSubmit}
              style={styles.formContainer}
            >
              <div className="input-field">
                <input
                  type="text"
                  id="email"
                  value={this.state.email}
                  onChange={this.handleEmailChange}
                />
                <label for="email" className="active">
                  Email
                </label>
              </div>
              <div className="input-field">
                <input
                  type="password"
                  id="password"
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                />
                <label for="password" className="active">
                  Password
                </label>
              </div>
              <input
                type="submit"
                value="submit"
                className="btn waves-effect waves-light btn-large teal"
                style={styles.buttonContainer}
              />
            </form>
          </div>
        );

      default:
        return <Redirect to="/stations" />;
    }
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

const styles = {
  formContainer: {
    marginTop: 30,
    backgroundColor: '#F6F3E4',
    padding: 10
  },

  buttonContainer: {
    marginTop: 10
  }
};

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(
  mapStateToProps,
  { loginUser }
)(LoginForm);
