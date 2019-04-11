import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAll1584Calcs, fetchAllArcProCalcs } from '../actions';

class Dashboard extends Component {
  componentDidMount() {
    this.props.fetchAll1584Calcs(this.props.auth.xauth);
    this.props.fetchAllArcProCalcs(this.props.auth.xauth);
  }

  getWithin30DaysArray(array) {
    if (array === undefined) {
      return [];
    }
    let reducedArray = array.filter(calc => {
      let fetchedDate = new Date(calc.calcParams.createdAt).getTime();
      let todaysDate = new Date().getTime();
      let differnceInDays =
        Math.abs(fetchedDate - todaysDate) / (1000 * 60 * 60 * 24);
      return differnceInDays < 1;
    });

    return reducedArray;
  }

  getDueIn1DayArray(array) {
    if (array === undefined) {
      return [];
    }
    let reducedArray = array.filter(calc => {
      let fetchedDate = new Date(calc.calcParams.createdAt).getTime();
      let todaysDate = new Date().getTime();
      let differnceInDays =
        Math.abs(fetchedDate - todaysDate) / (1000 * 60 * 60 * 24);
      return 0 < differnceInDays < 1;
    });

    return reducedArray;
  }

  latestCalcForEachStationArray(array) {
    if (array === undefined) {
      return [];
    }

    let reducedArray = array.reduce(
      (acc, next) => {
        const arrayIndex = acc.findIndex(element => {
          return element.calcParams.sub === next.calcParams.sub;
        });

        if (arrayIndex === -1) {
          acc.push(next);
        } else {
          let dateInArray = new Date(
            acc[arrayIndex].calcParams.createdAt
          ).getTime();
          let dateToCompare = new Date(next.calcParams.createdAt).getTime();
          console.log(arrayIndex);
          console.log(next.calcParams.boltedFaultCurrent, dateToCompare);
          console.log(
            acc[arrayIndex].calcParams.boltedFaultCurrent,
            dateInArray
          );

          if (dateToCompare > dateInArray) {
            acc[arrayIndex] = next;
          }
        }
        return acc;
      },
      [array[0]]
    );

    console.log(reducedArray);
    return reducedArray;
  }

  render() {
    const { all1584Calcs, allArcProCalcs } = this.props;

    const calc1584Within30Days = this.getWithin30DaysArray(all1584Calcs);
    const arcProCalcsWithin30Days = this.getWithin30DaysArray(allArcProCalcs);

    const latest1584Array = this.latestCalcForEachStationArray(all1584Calcs);
    const latestArcProArray = this.latestCalcForEachStationArray(
      allArcProCalcs
    );
    const calc1584DueIn90Days = this.getDueIn1DayArray(latest1584Array);
    const arcProCalcsDueIn90Days = this.getDueIn1DayArray(latestArcProArray);

    return (
      <div className="row" style={{ marginTop: 10 }}>
        <div
          className="col s10 m4 offset-m1 offset-s1 z-depth-1 "
          style={styles.cardContainer}
        >
          <div style={styles.iconContainer}>
            <i class="material-icons" style={{ fontSize: '8em' }}>
              keyboard
            </i>
          </div>
          <div style={styles.textContainer}>
            <p style={styles.bigNumber}>{calc1584Within30Days.length} 1584</p>
            <p style={styles.bigNumber}>
              {arcProCalcsWithin30Days.length} Arc Pro
            </p>
            <p style={{ margin: 0 }}>Calculations completed last 30 days</p>
          </div>
        </div>
        <div
          className="col s10 m4 offset-m2 offset-s1 z-depth-1"
          style={styles.cardContainer}
        >
          <div style={styles.iconContainer}>
            <i class="material-icons" style={{ fontSize: '8em' }}>
              date_range
            </i>
          </div>
          <div style={styles.textContainer}>
            <p style={styles.bigNumber}>{calc1584DueIn90Days.length} 1584</p>
            <p style={styles.bigNumber}>
              {arcProCalcsDueIn90Days.length} Arc Pro
            </p>
            <p style={{ margin: 0 }}>Calculations due in 90 days</p>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    display: ' flex',
    flexDirection: 'row',
    alignContent: 'space-around'
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#F6F3E4',
    marginTop: 10
  },
  iconContainer: {
    display: 'flex',
    flex: 0.25,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textContainer: {
    display: 'flex',
    flex: 0.75,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingLeft: '10px'
  },
  bigNumber: {
    fontSize: '2em',
    margin: 0
  }
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    all1584Calcs: state.all1584Calcs.calculations,
    allArcProCalcs: state.allArcProCalcs.calculations
  };
}

export default connect(
  mapStateToProps,
  { fetchAll1584Calcs, fetchAllArcProCalcs }
)(Dashboard);
