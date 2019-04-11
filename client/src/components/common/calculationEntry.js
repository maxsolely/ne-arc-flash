import React from 'react';
import { Link } from 'react-router-dom';

const CalculationEntry = ({
  date,
  comment,
  incidentEnergy,
  eightCal,
  hrcLevel,
  calcID,
  wholeCalcObject
}) => {
  const { lineVoltage } = wholeCalcObject.calcParams;
  return (
    <section className="z-depth-3" style={styles.section}>
      <div
        className="valign-wrapper indigo row z-depth-1 white-text"
        style={styles.topCardSection}
      >
        <p
          className="flow-text col s2 center-align  "
          style={{ color: '#B5A33F', padding: 0 }}
        >
          Date: <span style={{ display: 'block' }}>{date}</span>
        </p>
        <div
          className="flow-text col s8 center-align "
          style={styles.energyCol}
        >
          <p>
            Arc Flash Energy: <span className="white-text">{eightCal}</span>
          </p>
          <p>
            Incident Energy:{' '}
            <span className="white-text">{incidentEnergy}</span>
          </p>
        </div>
        <p className=" flow-text center-align col s2 " style={styles.hrcLevel}>
          HRC <span style={{ display: 'block' }}>{hrcLevel}</span>
        </p>
      </div>
      <div className="row">
        <p className="col s12" style={{ marginTop: 0 }}>
          Comment:{' '}
          <span className="truncate" style={{ display: 'block' }}>
            {comment}
          </span>
        </p>
      </div>
      <div className="row">
        {parseFloat(lineVoltage) < 20 ? (
          <Link
            to={{
              pathname: '/1584CalculationDetails',
              state: { calculation: wholeCalcObject }
            }}
            class="waves-effect waves-light btn-small col s2 offset-s5 indigo"
            style={{ marginBottom: '10px' }}
          >
            View
          </Link>
        ) : (
          <Link
            to={{
              pathname: '/ArcProCalculationDetails',
              state: { calculation: wholeCalcObject }
            }}
            class="waves-effect waves-light btn-small col s2 offset-s5 indigo"
            style={{ marginBottom: '10px' }}
          >
            View
          </Link>
        )}
      </div>
    </section>
  );
};

const styles = {
  section: {
    borderRadius: 25
  },
  topCardSection: {
    borderRadius: '25px 25px 0px 0px'
  },
  energyCol: {
    borderLeft: '1.5px solid #ffffff',
    color: '#B5A33F'
  },
  hrcLevel: {
    backgroundColor: '#607D8B',
    // color: '#ffe082',
    color: '#ffffffff',
    borderRadius: '10% 25%',
    margin: '0 10px'
  }
};

export { CalculationEntry };
