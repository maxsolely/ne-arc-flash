import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Header from './Header';
import LoginForm from './LoginForm';
import Stations from './Stations';

const CalcNew = () => <h2>CalcNew</h2>;
const Landing = () => <h2>Landing</h2>;
const Dashboard = () => <h2>Dashboard</h2>;

class App extends Component {
  componentDidMount() {
    console.log('state from the app component', this.props.auth);
    this.props.fetchUser(this.props.auth.xauth);
  }

  render() {
    return (
      <div className="container">
        <BrowserRouter>
          <div>
            <Header />
            <Route exact path="/" component={Landing} />
            <Route path="/login" component={LoginForm} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/stations" component={Stations} />
            <Route path="/calcs/new" component={CalcNew} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return { auth: state.auth };
}
export default connect(
  mapStateToProps,
  actions
)(App);
