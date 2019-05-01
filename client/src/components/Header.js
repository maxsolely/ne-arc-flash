import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Header extends Component {
  renderContent() {
    switch (this.props.auth._id) {
      case null:
        return;
      case false:
        return (
          <li>
            <Link to="/login">Login</Link>
          </li>
        );
      default:
        return (
          <div>
            <li>
              <Link to="/stations">Stations</Link>
            </li>
            <li className="hide-on-small-and-down">
              <Link to="/addStation">Add Station</Link>
            </li>
            <li>
              <a href="#">Logout</a>
            </li>
          </div>
        );
    }
  }

  render() {
    return (
      <nav>
        <div className="nav-wrapper indigo">
          <div style={{ paddingLeft: 15 }}>
            <Link
              to={this.props.auth._id ? '/stations' : '/login'}
              className="left brand-logo"
            >
              NE Arc Flash
            </Link>
          </div>
          <ul className="right ">{this.renderContent()}</ul>
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(mapStateToProps)(Header);
