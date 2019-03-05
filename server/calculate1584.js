// ['sub', 'division', faultType', 'stationConfig', 'grounded', 'lineVoltage', 'faultCurrent', 'relayOpTime']

var dummyData = {
  stationConfig: 'Metalclad',
  grounded: true,
  lineVoltage: 11,
  faultCurrent: 5643,
  relayOpTime: 0.873
};

var calculate1584Results = calcParams => {
  var lineVoltage = parseFloat(calcParams.lineVoltage);
  var arcGapInches;
  var workDistanceInches;
  var hrcLevel;
  var k1 = calcParams.stationConfig === 'Open-Air' ? -0.792 : -0.555;
  var k2 = calcParams.grounded ? -0.113 : 0;
  var distanceFactor = calcParams.stationConfig === 'Open-Air' ? 2 : 0.973;
  var totalClearingTime = calcParams.relayOpTime + 0.108;

  if (calcParams.stationConfig === 'Open-Air') {
    arcGapInches = lineVoltage >= 11.5 && lineVoltage <= 13.2 ? 9 : 6.2;
  } else if (calcParams.stationConfig === 'Metalclad') {
    arcGapInches = lineVoltage < 13.2 ? 4 : 6;
  }

  if (calcParams.stationConfig === 'Open-Air') {
    workDistanceInches = lineVoltage > 4.16 && lineVoltage < 11.5 ? 25 : 26;
  } else if (calcParams.stationConfig === 'Metalclad') {
    workDistanceInches = 36;
  }

  var arcGapmm = arcGapInches * 25.4;
  var workDistancemm = workDistanceInches * 25.4;

  var arcCurrentExpPower =
    0.00402 * Math.log(10) + 0.983 * Math.log(calcParams.faultCurrent / 1000);

  var arcCurrent = Math.exp(arcCurrentExpPower);

  arcCurrent = arcCurrent.toFixed(2);

  var incidentEnergyExpPower =
    (k1 + k2 + 0.0011 * arcGapmm) * Math.log(10) + 1.081 * Math.log(arcCurrent);

  var incidentEnergy =
    Math.exp(incidentEnergyExpPower) *
    (totalClearingTime / 0.2) *
    (Math.pow(610, distanceFactor) / Math.pow(workDistancemm, distanceFactor));

  incidentEnergy = incidentEnergy.toFixed(2);

  var eightCalBoundary =
    Math.pow(
      4.184 *
        Math.exp(incidentEnergyExpPower) *
        (totalClearingTime / 0.2) *
        (Math.pow(610, distanceFactor) / (8 * 4.184)),
      1 / distanceFactor
    ) / 25.4;

  eightCalBoundary = eightCalBoundary.toFixed(2);

  if (incidentEnergy <= 4) {
    hrcLevel = '1';
  } else if (incidentEnergy > 4 && incidentEnergy <= 8) {
    hrcLevel = '2';
  } else if (incidentEnergy > 8 && incidentEnergy <= 25) {
    hrcLevel = '3';
  } else if (incidentEnergy > 25 && incidentEnergy <= 40) {
    hrcLevel = '4';
  } else {
    hrcLevel = 'Exceeds Level 4';
  }

  if (isNaN(arcCurrent) || isNaN(incidentEnergy) || isNaN(eightCalBoundary)) {
    return {};
  } else {
    return { arcCurrent, incidentEnergy, eightCalBoundary, hrcLevel };
  }
};

// calculated1684Results(dummyData);

module.exports = { calculate1584Results };
