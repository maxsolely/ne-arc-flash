var { User } = require('./../models/user');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token)
    .then(user => {
      if (!user) {
        return Promise.reject();
      }
      req.user = user;
      req.token = token;
      req.role = user.role;
      next();
    })
    .catch(e => {
      res.send('').status(401);
      // res.status(401).send('you need to login');
    });
};

module.exports = { authenticate };
