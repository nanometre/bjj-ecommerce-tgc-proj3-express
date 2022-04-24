const bookshelf = require('../bookshelf');

const Product = bookshelf.model('Product', {
    tableName: 'products',
    material() {
        return this.belongsTo('Material')
    },
    weave() {
        return this.belongsTo('Weave')
    },
    category() {
        return this.belongsTo('Category')
    },
    brand() {
        return this.belongsTo('Brand')
    }
});

const Material = bookshelf.model('Material', {
    tableName: 'materials',
    products() {
        return this.hasMany('Product')
    }
})

const Weave = bookshelf.model('Weave', {
    tableName: 'weaves',
    products() {
        return this.hasMany('Product')
    }
})

const Category = bookshelf.model('Category', {
    tableName: 'categories',
    products() {
        return this.hasMany('Product')
    }
})

const Brand = bookshelf.model('Brand', {
    tableName: 'brands',
    products() {
        return this.hasMany('Product')
    }
})

module.exports = { Product, Material, Weave, Category, Brand }