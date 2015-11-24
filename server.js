var keystone = require('keystone'),
    handlebars = require('express-handlebars');

keystone.init({

  'name': 'ga_keystone_demo',

  'favicon': 'public/favicon.ico',
  'static': 'public',

  'views': 'templates/views',
  'view engine': 'hbs',

  'custom engine': handlebars.create({
    layoutsDir: 'templates/layouts',
    defaultLayout: 'default',
    extname: '.hbs'
  }).engine,

  'auto update': true,
  'mongo': 'mongodb://localhost/ga_keystone_demo',

  'auth': true,
  'user model': 'User',
  'cookie secret': 'youcanthavecrabstillyoufinishthelab'
})

require('./models');

keystone.set('routes', require('./routes'));
keystone.start();
