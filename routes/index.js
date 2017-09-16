var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
    views: importRoutes('./views'),
    api: importRoutes('./api')
};

// Setup Route Bindings
exports = module.exports = function(app) {
    // Views
    app.get('/', routes.views.index);
    app.get('/menu', routes.views.menu);
    app.get('/events/:category?', routes.views.events);
    app.get('/events/post/:post', routes.views.post);
    app.get('/archive', routes.views.archive);

    //Image Upload Route
    app.get('/api/imageupload/list', keystone.middleware.api, routes.api.imageupload.list);
    app.get('/api/imageupload/:id', keystone.middleware.api, routes.api.imageupload.get);
    app.all('/api/imageupload/:id/update', keystone.middleware.api, routes.api.imageupload.update);
    app.all('/api/imageupload/create', keystone.middleware.api, routes.api.imageupload.create);
    app.get('/api/imageupload/:id/remove', keystone.middleware.api, routes.api.imageupload.remove);

};