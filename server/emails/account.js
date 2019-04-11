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
