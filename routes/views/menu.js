var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'menu';

	// Load menus
	view.query('menu', keystone.list('Menu').model.find({
        state: 'published'
    }));

	// Render the view
	view.render('menu');
};
