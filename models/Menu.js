var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Menu Model
 * ==========
 */

var Menu = new keystone.List('Menu', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Menu.add({
	title: { type: String, required: true },
	price: { type: Types.Money },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	cocktail: {
		filter: { type: Types.Select, options: 'Beer, Wine, Cocktail' },
		ingredients: { type: Types.Html, wysiwyg: true, height: 150 },
		quote: { type: Types.Html, wysiwyg: true, height: 150 },
	},
});

Menu.schema.virtual('cocktail.full').get(function () {
	return this.cocktail.ingredients || this.cocktail.quote;
});

Menu.defaultColumns = 'title, filter|20%, state|20%, price|20%';
Menu.register();
