var keystone = require('keystone'),
    User = keystone.list('User');

exports = module.exports = function (done) {

  new User.model({

    name: { first: 'Greg', last: 'Dunn' },
    email: 'grdunn@foo.bar',
    password: 'password',
    canAccessKeystone: true
  }).save(done)

};
