var mongoose = require('mongoose');
const voltageEnums = ['4 kV', '13.8 kV', '34.5 kV', '69 kV', '115 kV'];

var ArcCalc = mongoose.model('ArcCalc', {
  calcParams: {
    sub1: {
      type: String,
      trim: true,
      required: true
    },
    sub2: {
      type: String,
      trim: true,
      required: true
    },
    faultCurrent: {
      type: Number,
      required: true
    },
    relayOpTime: {
      type: Number,
      required: true
    },
    lineVoltage: {
      type: String,
      required: true,
      enum: voltageEnums
    },
    lineNumber: {
      type: String,
      trim: true,
      required: true
    },
    faultType: {
      type: String,
      trim: true,
      required: true,
      enum: ['1 phase', '3 phase']
    },
    stationType: {
      type: String,
      required: true,
      enum: ['Metalclad', 'Open-Air']
    },
    grounded: {
      type: Boolean,
      required: true
    }
  },
  arcCaseInput: {
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
    distanceToArc: {
      type: Number,
      required: true
    }
  },
  results: {
    arcVoltage: {
      type: Number,
      required: true
    },
    arcEnergy: {
      type: Number,
      required: true
    },
    incidentEnergy: {
      type: Number,
      required: true
    },
    hrcLevel: {
      type: Number,
      required: true
    }
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = { arcCalc };
