const { Product, Material, Weave, Category, Brand } = require('../models');

const getProductById = async (productId) => {
    return await Product.where({
        product_id: productId
    }).fetch({
        require: true,
        withRelated: ['material', 'weave', 'category', 'brand']
    })
}

const getAllMaterials = async () => {
    return await Material.fetchAll().map(material => {
        return [material.get('material_id'), material.get('material_name')]
    })
}

const getAllWeaves = async () => {
    return await Weave.fetchAll().map(weave => {
        return [weave.get('weave_id'), weave.get('weave_name')]
    })
}

const getAllCategories = async () => {
    return await Category.fetchAll().map(category => {
        return [category.get('category_id'), category.get('category_name')]
    })
}

const getAllBrands = async () => {
    return await Brand.fetchAll().map(brand => {
        return [brand.get('brand_id'), brand.get('brand_name')]
    })
}

module.exports = { getProductById, getAllMaterials, getAllWeaves, getAllCategories, getAllBrands }