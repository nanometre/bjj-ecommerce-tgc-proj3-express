// =================================================
// ============== Import Dependencies ==============
// =================================================
const express = require('express')
const router = express.Router()
const { bootstrapField, createMaterialForm, createProductForm } = require('../forms')
const { Product } = require('../models')
const productDataLayer = require('../dal/products')
const { route } = require('express/lib/application')

// =================================================
// =========== Get Form Selection Fields ===========
// =================================================
const getFormSelection = async () => {
    const allMaterials = await productDataLayer.getAllMaterials()
    allMaterials.unshift(['', '--- Select Material ---'])
    const allWeaves = await productDataLayer.getAllWeaves()
    allWeaves.unshift(['', '--- Select Weave ---'])
    const allCategories = await productDataLayer.getAllCategories()
    allCategories.unshift(['', '--- Select Category ---'])
    const allBrands = await productDataLayer.getAllBrands()
    allBrands.unshift(['', '--- Select Brand ---'])
    return { allMaterials, allWeaves, allCategories, allBrands }
} 

// =================================================
// ================== Set Routes ===================
// =================================================
router.get('/', async (req, res) => {
    const products = await Product.collection().fetch({
        withRelated: ['material', 'weave', 'category', 'brand']
    })
    res.render('../views/products/index', {
        products: products.toJSON()
    })
})

router.get('/create', async (req, res) => {
    const { allMaterials, allWeaves, allCategories, allBrands } = await getFormSelection()
    const productForm = createProductForm(allMaterials, allWeaves, allCategories, allBrands)

    res.render('../views/products/create', {
        productForm: productForm.toHTML(bootstrapField)
    })
})

router.post('/create', async (req, res) => {
    const { allMaterials, allWeaves, allCategories, allBrands } = await getFormSelection()
    const productForm = createProductForm(allMaterials, allWeaves, allCategories, allBrands)

    productForm.handle(req, {
        'success': async (form) => {
            const product = new Product(form.data)
            product.save()
            res.redirect('/products')
        },
        'error': async (form) => {
            res.render('products/create', {
                productForm: form.toHTML(bootstrapField)
            })
        } 
    })
})

router.get('/:product_id/update', async (req, res) => {
    const product = await productDataLayer.getProductById(req.params.product_id)
    const { allMaterials, allWeaves, allCategories, allBrands } = await getFormSelection()
    const productForm = createProductForm(allMaterials, allWeaves, allCategories, allBrands)

    for (field in productForm.fields) {
        productForm.fields[field].value = product.get(field)
    }
    res.render('products/update', {
        productForm: productForm.toHTML(bootstrapField),
        product: product.toJSON()
    })
})

router.post('/:product_id/update', async (req, res) => {
    const product = await productDataLayer.getProductById(req.params.product_id)
    const { allMaterials, allWeaves, allCategories, allBrands } = await getFormSelection()
    const productForm = createProductForm(allMaterials, allWeaves, allCategories, allBrands)

    productForm.handle(req, {
        'success': async (form) => {
            product.set(form.data)
            product.save()
            res.redirect('/products')
        },
        'error': async (form) => {
            res.render('products/update', {
                productForm: form.toHTML(bootstrapField),
                product: product
            })
        } 
    })
})

router.get('/:product_id/delete', async (req, res) => {
    const product = await productDataLayer.getProductById(req.params.product_id)
    res.render('products/delete', {
        product: product.toJSON()
    })
})

router.post('/:product_id/delete', async (req, res) => {
    const product = await productDataLayer.getProductById(req.params.product_id)
    await product.destroy()
    res.redirect('/products')
})

router.get('/labels', async (req, res) => {
    const materialForm = createMaterialForm()
    res.render('../views/products/labels', {
        materialForm: materialForm.toHTML(bootstrapField)
    })
})

module.exports = router