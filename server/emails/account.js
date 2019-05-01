const sgMail = require('@sendgrid/mail');

const sendGridAPIKey =
  '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';

sgMail.setApiKey(sendGridAPIKey);

const sendNewCalcEmail = (division, stationName) => {
  let recipient;

  switch (division) {
    case 'Ocean State':
      recipient = 'maxim.solomonyuk@nationalgrid.com';
      break;

    case 'Bay State West':
      recipient = 'nicholas.perls@nationalgrid.com';
      break;

    case 'Bay State South':
      recipient = 'erik.pola@nationalgrid.com';
      break;

    case 'North and Granite':
      recipient = 'eric.doyle@nationalgrid.com';
      break;

    default:
      recipient = 'maxim.solomonyuk@nationalgrid.com';
  }
  sgMail.send({
    to: recipient,
    from: 'maxim.solomonyuk@nationalgrid.com',
    subject: 'This is from Arc Flash',
    text: `This is an email to tell you that a new calculation for ${stationName} has been recorded in the database`
  });
};

module.exports = {
  sendNewCalcEmail
};
