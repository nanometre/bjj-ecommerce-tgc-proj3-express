const bookshelf = require('../bookshelf');

// =============================================================================
// ============================ Models for 'users' =============================
// =============================================================================
const User = bookshelf.model('User', {
    tableName: 'users',
    idAttribute: 'user_id',
    visible: ['user_id', 'email', 'first_name', 'last_name', 'user_type_id'],
    userType() {
        return this.belongsTo('UserType', 'user_type_id')
    },
    cartItems() {
        return this.hasMany('CartItem', 'cart_item_id')
    },
    orders() {
        return this.hasMany('Order', 'order_id')
    }
})

const UserType = bookshelf.model('UserType', {
    tableName: 'user_types',
    idAttribute: 'user_type_id',
    users() {
        return this.hasMany('User', 'user_id')
    }
})

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
    variants() {
        return this.hasMany('Variant', 'variant_id')
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
const Variant = bookshelf.model('Variant', {
    tableName: 'variants',
    idAttribute: 'variant_id',
    product() {
        return this.belongsTo('Product', 'product_id')
    },
    color() {
        return this.belongsTo('Color', 'color_id')
    },
    size() {
        return this.belongsTo('Size', 'size_id')
    },
    tags() {
        return this.belongsToMany('Tag', 'tags_variants', 'variant_id', 'tag_id')
    },
    cartItems() {
        return this.hasMany('CartItem', 'cart_item_id')
    },
    orders() {
        return this.belongsToMany('Order', 'order_items', 'variant_id', 'order_id')
    }
})

const Color = bookshelf.model('Color', {
    tableName: 'colors',
    idAttribute: 'color_id',
    variants() {
        return this.hasMany('Variant', 'variant_id')
    }
})

const Size = bookshelf.model('Size', {
    tableName: 'sizes',
    idAttribute: 'size_id',
    variants() {
        return this.hasMany('Variant', 'variant_id')
    }
})

const Tag = bookshelf.model('Tag', {
    tableName: 'tags',
    idAttribute: 'tag_id',
    variants() {
        return this.belongsToMany('Variant', 'tags_variants', 'tag_id', 'variant_id')
    }
})

// =============================================================================
// ============= Models for 'cart_items' and its supporting tables =============
// =============================================================================
const CartItem = bookshelf.model('CartItem', {
    tableName: 'cart_items',
    idAttribute: 'cart_item_id',
    variant() {
        return this.belongsTo('Variant', 'variant_id')
    },
    user() {
        return this.belongsTo('User', 'user_id')
    }
})

// =============================================================================
// =============== Models for 'orders' and its supporting tables ===============
// =============================================================================
const Order = bookshelf.model('Order', {
    tableName: 'orders',
    idAttribute: 'order_id',
    variants() {
        return this.belongsToMany('Variant', 'order_items', 'order_id', 'variant_id')
    },
    user() {
        return this.belongsTo('User', 'user_id')
    },
    status() {
        return this.belongsTo('Status', 'status_id')
    },
    address() {
        return this.belongsTo('Address', 'address_id')
    }
})

const Status = bookshelf.model('Status', {
    tableName: 'statuses',
    idAttribute: 'status_id',
    orders() {
        return this.hasMany('Order', 'order_id')
    }
})

const Address = bookshelf.model('Address', {
    tableName: 'addresses',
    idAttribute: 'address_id',
    order() {
        return this.hasOne('Order', 'order_id')
    }
})

module.exports = { 
    User, UserType,
    Product, Material, Weave, Category, Brand, 
    Variant, Color, Size, Tag,
    CartItem,
    Order, Status, Address
}