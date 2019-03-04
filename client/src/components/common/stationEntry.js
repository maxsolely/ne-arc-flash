import React from 'react';
import { Link } from 'react-router-dom';

const StationEntry = ({ name, division, voltage, calcs, stationID }) => {
  return (
    <div class="row" style={{ textAlign: 'center' }}>
      <div class="col s3">
        <span class="flow-text">{name}</span>
      </div>
      <div class="col s3">
        <span class="flow-text">{division}</span>
      </div>
      <div class="col s2">
        <span class="flow-text">{voltage}</span>
      </div>
      <div class="col s2">
        <span class="flow-text">{calcs}</span>
      </div>
      <div class="col s2">
        <Link
          to={{ pathname: '/stationProfile', state: { _id: stationID } }}
          class="waves-effect waves-light btn-small"
        >
          View
        </Link>
      </div>
    </div>
  );
};

export { StationEntry };
