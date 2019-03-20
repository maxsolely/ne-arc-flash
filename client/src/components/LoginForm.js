import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { Link } from 'react-router-dom';
import success from '../images/partnersSuccess.png';

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
          <form
            onSubmit={this.handleSubmit}
            className="container"
            style={styles.formContainer}
          >
            <div className="input-field s12">
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
            <div className="input-field s12">
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
        );

      default:
        return (
          // <div>
          //   <h1> you are logged in as {this.props.auth.email}</h1>
          //   <Link to="/dashboard">Go to dashboard</Link>
          // </div>

          <div className="row">
            <div
              className="col s12"
              style={{
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <div className="card teal">
                <div className="card-content white-text center-align ">
                  <span className="card-title">Login Success!</span>
                  <img src={success} />
                </div>
                <div className="card-action">
                  <Link className="text-amber center-align" to="/dashboard">
                    Go to dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
    }
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

const styles = {
  formContainer: {
    marginTop: 30
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
  actions
)(LoginForm);
