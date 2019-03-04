import React from 'react';
import { Link } from 'react-router-dom';

const CalculationEntry = ({
  faultType,
  incidentEnergy,
  eightCal,
  hrcLevel,
  calcID
}) => {
  return (
    <div class="row" style={{ textAlign: 'center' }}>
      <div class="col s2">
        <span class="flow-text">{calcID}</span>
      </div>
      <div class="col s2">
        <span class="flow-text">{faultType}</span>
      </div>
      <div class="col s2">
        <span class="flow-text">{incidentEnergy}</span>
      </div>
      <div class="col s2">
        <span class="flow-text">{eightCal}</span>
      </div>
      <div class="col s2">
        <span class="flow-text">{hrcLevel}</span>
      </div>
      <div class="col s2">
        <Link to={{ pathname: '/' }} class="waves-effect waves-light btn-small">
          View
        </Link>
      </div>
    </div>
  );
};

export { CalculationEntry };
