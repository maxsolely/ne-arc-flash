var mongoose = require('mongoose');
const voltageEnums = [
  '23 kV',
  '34.5 kV',
  '69 kV',
  '115 kV',
  '230 kV',
  '345 kV'
];
const divisionEnums = [
  'Bay State West',
  'North and Granite',
  'Bay State South',
  'Ocean State'
];
const hrcEnums = ['1', '2', '3', '4', 'Exceeds Level 4'];

// ['sub1', 'sub2', 'faultCurrent', 'relayOpTime', 'lineVoltage', 'lineNumber', 'faultType', 'stationType', 'grounded']
// ['current', 'sourceVoltage', 'duartion', 'electrodeMaterial', 'distanceToArc']
// ['arcVoltage', 'arcEnergy', 'incidentEnergy', 'hrcLevel' ]

var ArcCalcArcPro = mongoose.model('ArcCalc', {
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
      enum: ['1 phase', '3 phase']
    },
    stationConfig: {
      type: String,
      required: true,
      enum: ['Metalclad', 'Open-Air']
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
    grounded: {
      type: Boolean,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    comment: {
      type: String
    }
  },
  arcProInput: {
    current: {
      type: Number,
      required: true
    },
    sourceVoltage: {
      type: Number,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    electrodeMaterial: {
      type: String,
      required: true,
      trim: true,
      enum: ['Stainless Steel', 'Copper']
    },
    arcGap: {
      type: Number,
      required: true
    },
    distanceToArc: {
      type: Number,
      required: true
    }
  },
  arcProResults: {
    arcVoltage: {
      type: Number,
      required: true
    },
    arcEnergy: {
      type: Number,
      required: true
    },
    maxHeatFlux: {
      type: Number,
      required: true
    },
    heatFluxAtCircleR: {
      type: Number,
      required: true
    },
    heatFluxAtCircleZ: {
      type: Number,
      required: true
    },
    flux: {
      type: Number,
      required: true
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

module.exports = { ArcCalcArcPro };
