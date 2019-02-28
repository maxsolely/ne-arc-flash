import React from 'react';

const StationEntry = ({ name, division, voltage, calcs }) => {
  return (
    <div class="row" style={{ textAlign: 'center' }}>
      <div class="col s3">
        <span class="flow-text">{name}</span>
      </div>
      <div class="col s3">
        <span class="flow-text">{division}</span>
      </div>
      <div class="col s3">
        <span class="flow-text">{voltage}</span>
      </div>
      <div class="col s3">
        <span class="flow-text">{calcs}</span>
      </div>
    </div>
  );
};

export { StationEntry };
