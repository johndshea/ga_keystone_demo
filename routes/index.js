var keystone = require('keystone'),
    importRoutes = keystone.importer(__dirname)

var routes = {
  views: importRoutes('./views')
}

exports = module.exports = function (app) {
  app.get('/', routes.views.index)
};
