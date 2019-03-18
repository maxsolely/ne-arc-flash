import React from 'react';
import { Link } from 'react-router-dom';

const LoginCard = () => {
  return (
    <div className="row">
      <div
        className="col s12"
        style={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <div className="card teal">
          <div className="card-content white-text">
            <span className="card-title">Unauthorized Access</span>
            <p>
              You do not have permission to view this data. Please login to
              continue!
            </p>
          </div>
          <div className="card-action center-align">
            <Link className="amber-text" to={{ pathname: '/login' }}>
              {' '}
              Click Here To Login{' '}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export { LoginCard };
