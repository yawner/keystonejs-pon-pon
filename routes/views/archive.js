var keystone = require('keystone');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'archive';

    // Load the current post
    view.on('init', function(next) {

        var images = keystone.list('ImageUpload').model.find()
            .sort('-createdAt')
            .limit(5)
            .populate('images');
            console.log('archive images=' + images);

        images.exec(function(err, result) {
            if (result !== null) {
                var images = result;
                console.log('archive images=' + images);
            } else {
                console.log('404!!!');
                return res.status(404).render('errors/404');
            }
            next(err);
        });

    });

    // Load All Images
    view.query('archive', keystone.list('ImageUpload').model.find());

    // Render the view
    view.render('archive');
};