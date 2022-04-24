// =================================================
// ============== Import Dependencies ==============
// =================================================
const express = require('express')
const router = express.Router()
const { bootstrapField, createMaterialForm, createProductForm } = require('../forms')
const { Product } = require('../models')
const productDataLayer = require('../dal/products')

// =================================================
// ================== Set Routes ===================
// =================================================
router.get('/', async (req, res) => {
    const products = await Product.collection().fetch()
    res.render('../views/products/index', {
        products: products.toJSON()
    })
})

router.get('/create', async (req, res) => {
    const allMaterials = await productDataLayer.getAllMaterials()
    const allWeaves = await productDataLayer.getAllWeaves()
    const allCategories = await productDataLayer.getAllCategories()
    const allBrands = await productDataLayer.getAllBrands()

    const productForm = createProductForm(allMaterials, allWeaves, allCategories, allBrands)
    res.render('../views/products/create', {
        productForm: productForm.toHTML(bootstrapField)
    })
})

router.get('/labels', async (req, res) => {
    const materialForm = createMaterialForm()
    res.render('../views/products/labels', {
        materialForm: materialForm.toHTML(bootstrapField)
    })
})

module.exports = router