const { color } = require('forms/lib/widgets');
const bookshelf = require('../bookshelf');

// =============================================================================
// ============== Models for 'products' and its supporting tables ==============
// =============================================================================
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
    },
    productVariants() {
        return this.hasMany('ProductVariant', 'product_var_id')
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

// =============================================================================
// ========== Models for 'product_variants' and its supporting tables ==========
// =============================================================================
const ProductVariant = bookshelf.model('ProductVariant', {
    tableName: 'product_variants',
    idAttribute: 'product_var_id',
    product() {
        return this.belongsTo('Product', 'product_id')
    },
    color() {
        return this.belongsTo('Color', 'color_id')
    },
    size() {
        return this.belongsTo('Size', 'size_id')
    },
    productImages() {
        return this.hasMany('ProductImage', 'product_image_id')
    },
    tags() {
        return this.belongsToMany('Tag', 'tag_id')
    }
})

const Color = bookshelf.model('Color', {
    tableName: 'colors',
    idAttribute: 'color_id',
    productVariants() {
        return this.hasMany('ProductVariant', 'product_var_id')
    }
})

const Size = bookshelf.model('Size', {
    tableName: 'sizes',
    idAttribute: 'size_id',
    productVariants() {
        return this.hasMany('ProductVariant', 'product_var_id')
    }
})

const ProductImage = bookshelf.model('ProductImage', {
    tableName: 'product_images',
    idAttribute: 'product_image_id',
    productVariant() {
        return this.belongsTo('ProductVariant', 'product_var_id')
    }
})

const Tag = bookshelf.model('Tag', {
    tableName: 'tags',
    idAttribute: 'tag_id',
    productVariants() {
        return this.belongsToMany('ProductVariant', 'product_var_id')
    }
})

module.exports = { 
    Product, Material, Weave, Category, Brand, 
    ProductVariant, Color, Size, ProductImage, Tag 
}