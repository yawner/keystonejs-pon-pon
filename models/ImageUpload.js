var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Image Upload Model
 * ==================
 * A database model for uploading images to the local file system
 */

var ImageUpload = new keystone.List('ImageUpload', {
        nocreate: true,
        noedit: true,
});

var myStorage = new keystone.Storage({
        adapter: keystone.Storage.Adapters.FS,
        fs: {
                path: keystone.expandPath('./public/uploads/images'),
                publicPath: '/public/uploads/images',
        }
});

ImageUpload.add({
        name: { type: Types.Key, index: true },
        image: {
                type: Types.File,
                storage: myStorage
        },
        createdTimeStamp: { type: String },
        url: { type: String }
});


ImageUpload.defaultColumns = 'url, createdTimeStamp, image';
ImageUpload.register();
