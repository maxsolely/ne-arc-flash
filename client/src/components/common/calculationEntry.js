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
  return (
    <section className="z-depth-3" style={styles.section}>
      <div
        className="valign-wrapper row indigo lighten-2 z-depth-2 white-text"
        style={styles.topRow}
      >
        <p className="flow-text col s2" style={styles.date}>
          {date}
        </p>
        <div className="flow-text col s8" style={styles.energyCol}>
          <p>Arc Flash Energy: {eightCal}</p>
          <p>Incident Energy: {incidentEnergy}</p>
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
        <Link
          to={{
            pathname: '/calculationDetails',
            state: { calculation: wholeCalcObject }
          }}
          class="waves-effect waves-light btn-small col s4 offset-s4 amber darken-2"
          style={{ marginBottom: '10px' }}
        >
          View
        </Link>
      </div>
    </section>

    // <div class="row" style={{ textAlign: 'center' }}>
    //   <div class="col s2">
    //     <span class="flow-text">{calcID}</span>
    //   </div>
    //   <div class="col s2">
    //     <span class="flow-text">{faultType}</span>
    //   </div>
    //   <div class="col s2">
    //     <span class="flow-text">{incidentEnergy}</span>
    //   </div>
    //   <div class="col s2">
    //     <span class="flow-text">{eightCal}</span>
    //   </div>
    //   <div class="col s2">
    //     <span class="flow-text">{hrcLevel}</span>
    //   </div>
    //   <div class="col s2">
    //     <Link
    //       to={{
    //         pathname: '/calculationDetails',
    //         state: { calculation: wholeCalcObject }
    //       }}
    //       class="waves-effect waves-light btn-small"
    //     >
    //       View
    //     </Link>
    //   </div>
    // </div>
  );
};

const styles = {
  section: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#f5f5f5'
  },
  topRow: {},
  date: {},
  energyCol: {
    borderLeft: '1px dotted #ffa000'
  },
  hrcLevel: {
    backgroundColor: '#009688',
    color: '#ffecb3',
    borderRadius: '0%',
    margin: '0 10px'
  }
};

export { CalculationEntry };
