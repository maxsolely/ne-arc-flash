import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Header from './Header';
import LoginForm from './LoginForm';
import Stations from './Stations';
import NewStationForm from './NewStationForm';
import EditStationForm from './EditStationForm';
import New1584Form from './New1584Form';
import NewArcProForm from './NewArcProForm';
import StationProfile from './StationProfile';
import Calculation1584Details from './Calculation1584Details';
import CalculationArcProDetails from './CalculationArcProDetails';

const Landing = () => <h2>Landing</h2>;

class App extends Component {
  componentDidMount() {
    console.log('state from the app component', this.props.auth);
    this.props.fetchUser(this.props.auth.xauth);
  }

  render() {
    return (
      <div className="container grey lighten-4" style={{ height: '100vh' }}>
        <BrowserRouter>
          <div>
            <Header />
            <Route exact path="/" component={Landing} />
            <Route path="/login" component={LoginForm} />
            <Route path="/stations" component={Stations} />
            <Route path="/addStation" component={NewStationForm} />
            <Route path="/stationProfile" component={StationProfile} />
            <Route
              path="/1584CalculationDetails"
              component={Calculation1584Details}
            />
            <Route
              path="/ArcProCalculationDetails"
              component={CalculationArcProDetails}
            />
            <Route path="/add1584Calculation" component={New1584Form} />
            <Route path="/addArcProCalculation" component={NewArcProForm} />
            <Route path="/editStation" component={EditStationForm} />
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
