const { 
    Product, Material, Weave, Category, Brand, 
    Variant, Color, Size, Tag
} = require('../models');

// =================================================
// =========== Product Data Access Layer ===========
// =================================================
const getProducts = async () => {
    return await Product.fetchAll({
        withRelated: ['material', 'weave', 'category', 'brand', 'variants']
    })
}

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

// =================================================
// ======= Product Variant Data Access Layer =======
// =================================================

const getVariantsByProductId = async (productId) => {
    return await Variant.where({
        product_id: productId
    }).fetchAll({
        require: false,
        withRelated: ['product', 'color', 'size', 'tags']
    })
}

const getVariantById = async (variantId) => {
    return await Variant.where({
        variant_id: variantId
    }).fetch({
        require: true,
        withRelated: ['product', 'color', 'size', 'tags']
    })
}

const getAllColors = async () => {
    return await Color.fetchAll().map(color => {
        return [color.get('color_id'), color.get('color_name')]
    })
}

const getAllSizes = async () => {
    return await Size.fetchAll().map(size => {
        return [size.get('size_id'), size.get('size_name')]
    })
}

const getAllTags = async () => {
    return await Tag.fetchAll().map(tag => {
        return [tag.get('tag_id'), tag.get('tag_name')]
    })
}

module.exports = { 
    getProducts, getProductById, getAllMaterials, getAllWeaves, getAllCategories, getAllBrands,
    getVariantsByProductId, getVariantById, getAllColors, getAllSizes, getAllTags
}