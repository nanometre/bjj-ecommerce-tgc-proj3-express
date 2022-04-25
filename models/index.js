const bookshelf = require('../bookshelf');

const Product = bookshelf.model('Product', {
    tableName: 'products',
    idAttribute: 'product_id',
    material() {
        return this.belongsTo('Material', 'material_id')
    },
    weave() {
        return this.belongsTo('Weave', 'weave_id')
    },
    category() {
        return this.belongsTo('Category', 'category_id')
    },
    brand() {
        return this.belongsTo('Brand', 'brand_id')
    }
});

const Material = bookshelf.model('Material', {
    tableName: 'materials',
    idAttribute: 'material_id',
    products() {
        return this.hasMany('Product', 'product_id')
    }
})

const Weave = bookshelf.model('Weave', {
    tableName: 'weaves',
    idAttribute: 'weave_id',
    products() {
        return this.hasMany('Product', 'product_id')
    }
})

const Category = bookshelf.model('Category', {
    tableName: 'categories',
    idAttribute: 'category_id',
    products() {
        return this.hasMany('Product', 'product_id')
    }
})

const Brand = bookshelf.model('Brand', {
    tableName: 'brands',
    idAttribute: 'brand_id',
    products() {
        return this.hasMany('Product', 'product_id')
    }
})

module.exports = { Product, Material, Weave, Category, Brand }