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
const electordeConfigEnums = ['VCB', 'VCBB', 'HCB', 'VOA', 'HOA'];

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
    electrodeConfig: {
      type: String,
      trim: true,
      required: true,
      enum: electordeConfigEnums
    },
    lineVoltage: {
      type: String,
      trim: true,
      required: true,
      enum: voltageEnums
    },
    boltedFaultCurrent: {
      type: Number,
      required: true
    },
    totalClearingTime: {
      type: Number,
      required: true
    },
    comment: {
      type: String
    }
  },
  results: {
    incidentEnergy: {
      type: Number,
      required: true
    },
    calculatedArcFlashEnergy: {
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

// add electrode arrangment
// take grounded out
//bolted fault current instead of fault current
// total clearing time instead of realay op time. Total clearing (relay op time + breaker clearing)
//get ride of arcCurrent from results
// eightCalBoundary becomes calculcated arc flash energy which is then used to figure out HRC level
