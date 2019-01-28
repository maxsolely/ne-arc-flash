var mongoose = require('mongoose');
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
const areaEnums = [
  'Bay State West',
  'North and Granite',
  'Bay State South',
  'Ocean State'
];

// ['sub', 'faultType', 'stationConfig', 'grounded', 'lineVoltage', 'faultCurrent', 'relayOpTime']
// ['arcCurrent', 'incidentEnergy', 'eightCalBoundary', 'hrcLevel' ]

var ArcCalc1584 = mongoose.model('ArcCalc', {
  calcParams: {
    sub: {
      type: String,
      trim: true,
      required: true
    },
    area: {
      type: String,
      trim: true,
      required: true,
      enum: areaEnums
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
      enum: ['Metalclad', 'Open-Air']
    },
    grounded: {
      type: Boolean,
      required: true
    },
    lineVoltage: {
      type: Number,
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
      required: true
    }
  }
});

module.exports = { ArcCalc1584 };
