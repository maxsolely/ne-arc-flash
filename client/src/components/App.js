import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Header from './Header';
import LoginForm from './LoginForm';
import Stations from './Stations';
import NewStationForm from './NewStationForm';
import New1584Form from './New1584Form';
import StationProfile from './StationProfile';
import CalculationDetails from './CalculationDetails';

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
            <Route path="/addStation" component={NewStationForm} />
            <Route path="/stationProfile" component={StationProfile} />
            <Route path="/calculationDetails" component={CalculationDetails} />
            <Route path="/add1584Calculation" component={New1584Form} />
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
