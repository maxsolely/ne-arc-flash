var mongoose = require('mongoose');
// Because I want enums, I need to make voltage a string. When I do the calculation in 'calculate1584.js' I will trim the last 3 chars(' kV') and convert the string to a number
const voltageEnums = [
  '2.4 kV',
  '4.1 kV',
  '4.16 kV',
  '6.9 kV',
  '11 kV',
  '11.5 kV',
  '12.4 kV',
  '12.47 kV',
  '13.2 kV',
  '13.8 kV'
];
const divisionEnums = [
  'Bay State West',
  'North and Granite',
  'Bay State South',
  'Ocean State'
];

const hrcEnums = ['1', '2', '3', '4', 'Exceeds Level 4'];

// ['sub', 'division', faultType', 'stationConfig', 'grounded', 'lineVoltage', 'faultCurrent', 'relayOpTime']
// ['arcCurrent', 'incidentEnergy', 'eightCalBoundary', 'hrcLevel' ]

var ArcCalc1584 = mongoose.model('ArcCalc1584', {
  calcParams: {
    sub: {
      type: String,
      trim: true,
      required: true
    },
    sub2: {
      type: String,
      trim: true,
      required: true
    },
    division: {
      type: String,
      trim: true,
      required: true,
      enum: divisionEnums
    },
    faultType: {
      type: String,
      trim: true,
      required: true,
      enum: ['3 phase']
    },
    stationConfig: {
      type: String,
      required: true,
      trim: true,
      enum: ['Metalclad', 'Open-Air']
    },
    grounded: {
      type: Boolean,
      required: true
    },
    lineVoltage: {
      type: String,
      trim: true,
      required: true,
      enum: voltageEnums
    },
    faultCurrent: {
      type: Number,
      required: true
    },
    relayOpTime: {
      type: Number,
      required: true
    },
    comment: {
      type: String
    }
  },
  results: {
    arcCurrent: {
      type: Number,
      required: true
    },
    incidentEnergy: {
      type: Number,
      required: true
    },
    eightCalBoundary: {
      type: Number,
      required: true
    },
    hrcLevel: {
      type: String,
      required: true,
      enum: hrcEnums
    }
  }
});

module.exports = { ArcCalc1584 };
