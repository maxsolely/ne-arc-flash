var mongoose = require('mongoose');
const voltageEnums = ['4 kV', '13.8 kV', '34.5 kV', '69 kV', '115 kV'];

var Station = mongoose.model('Station', {
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  division: {
    type: String,
    required: true,
    enum: [
      'Ocean State',
      'Bay State West',
      'Bay State South',
      'North and Granite'
    ]
  },
  voltage: {
    type: String,
    required: true,
    enum: voltageEnums
  },
  stationConfig: {
    type: String,
    required: true,
    enum: ['Metalclad', 'Open-Air']
  },
  stationCalcs: [
    {
      calculation: {
        type: mongoose.Schema.Types.ObjectId
      }
    }
  ]
});

module.exports = { Station };

//, 'Bay State South', 'Bay State West'
