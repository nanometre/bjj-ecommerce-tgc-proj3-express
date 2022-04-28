// =================================================
// ============== Import Dependencies ==============
// =================================================
const express = require('express')
const router = express.Router()
const { bootstrapField, createProductForm, createVariantForm, createMaterialForm } = require('../../forms')
const { Product, Variant } = require('../../models')
const productDataLayer = require('../../dal/products')

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
    const allColors = await productDataLayer.getAllColors()
    allColors.unshift(['', '--- Select Color ---'])
    const allSizes = await productDataLayer.getAllSizes()
    allSizes.unshift(['', '--- Select Size ---'])
    const allTags = await productDataLayer.getAllTags()
    return { allMaterials, allWeaves, allCategories, allBrands, allColors, allSizes, allTags }
} 

// =================================================
// ================== Set Routes ===================
// =================================================

// ===============================
// ======= Product Routes ========
// ===============================
router.get('/', async (req, res) => {
    const products = await Product.collection().fetch({
        withRelated: ['material', 'weave', 'category', 'brand']
    })
    res.render('products/index', {
        products: products.toJSON()
    })
})

router.get('/create', async (req, res) => {
    const { allMaterials, allWeaves, allCategories, allBrands } = await getFormSelection()
    const productForm = createProductForm(allMaterials, allWeaves, allCategories, allBrands)

    res.render('products/create', {
        productForm: productForm.toHTML(bootstrapField)
    })
})

router.post('/create', async (req, res) => {
    const { allMaterials, allWeaves, allCategories, allBrands } = await getFormSelection()
    const productForm = createProductForm(allMaterials, allWeaves, allCategories, allBrands)

    productForm.handle(req, {
        'success': async (form) => {
            let { cost, ...productData } = form.data
            cost = cost * 100
            const product = new Product({cost, ...productData})
            product.save()
            req.flash('success_messages', `New product "${product.get('product_name')}" has been created.`)
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
        if (field === 'cost') {
            productForm.fields[field].value = product.get(field) / 100
        } else {
            productForm.fields[field].value = product.get(field)
        }
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
            let { cost, ...productData } = form.data
            cost = cost * 100
            product.set({cost, ...productData})
            product.save()
            req.flash('success_messages', `"${product.get('product_name')}" has been updated.`)
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
    req.flash('success_messages', `"${product.get('product_name')}" has been deleted.`)
    await product.destroy()
    res.redirect('/products')
})

// ================================
// ==== Product Variant Routes ====
// ================================

router.get('/:product_id/variants', async (req, res) => {
    const product = await productDataLayer.getProductById(req.params.product_id)
    const variants = await productDataLayer.getVariantsByProductId(req.params.product_id)
    res.render('products/variants', {
        product: product.toJSON(),
        variants: variants.toJSON()
    })
})

router.get('/:product_id/variants/create', async (req, res) => {
    const product = await productDataLayer.getProductById(req.params.product_id)
    const { allColors, allSizes, allTags } = await getFormSelection()
    const variantForm = createVariantForm(allColors, allSizes, allTags)

    res.render('products/variants-create', {
        product: product.toJSON(),
        variantForm: variantForm.toHTML(bootstrapField)
    })
})

router.post('/:product_id/variants/create', async (req, res) => {
    const product = await productDataLayer.getProductById(req.params.product_id)
    const { allColors , allSizes, allTags } = await getFormSelection()
    const variantForm = createVariantForm(allColors, allSizes, allTags)

    variantForm.handle(req, {
        'success': async (form) => {
            let { tags, ...variantData } = form.data
            const variant = new Variant({
                product_id: req.params.product_id,
                ...variantData
            })
            await variant.save()
            if (tags) {
                await variant.tags().attach(tags.split(','))
            }
            req.flash('success_messages', `New product variant has been created.`)
            res.redirect(`/products/${req.params.product_id}/variants`)
        },
        'error': async (form) => {
            res.render('products/variants-create', {
                product: product.toJSON(),
                variantForm: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:product_id/variants/:variant_id/update', async (req, res) => {
    const variant = await productDataLayer.getVariantByIds(req.params.product_id, req.params.variant_id)
    const { allColors, allSizes, allTags } = await getFormSelection()
    const variantForm = createVariantForm(allColors, allSizes, allTags)

    for (field in variantForm.fields) {
        if (field !== 'tags') {
            variantForm.fields[field].value = variant.get([field])
        }
    }
    let selectedTags = await variant.related('tags').pluck('tag_id')
    variantForm.fields.tags.value = selectedTags

    res.render('products/variants-update', {
        variant: variant.toJSON(),
        variantForm: variantForm.toHTML(bootstrapField)
    })
})

router.post('/:product_id/variants/:variant_id/update', async (req, res) => {
    const variant = await productDataLayer.getVariantByIds(req.params.product_id, req.params.variant_id)
    const { allColors, allSizes, allTags } = await getFormSelection()
    const variantForm = createVariantForm(allColors, allSizes, allTags)

    variantForm.handle(req, {
        'success': async (form) => {
            let { tags, ...variantData } = form.data
            variant.set(variantData)
            variant.save()
            
            let tagIds = tags.split(',')
            let existingTagIds = await variant.related('tags').pluck('tag_id')
            let tagsToRemove = existingTagIds.filter(id => tagIds.includes(id) === false)
            await variant.tags().detach(tagsToRemove)
            await variant.tags().attach(tagIds)

            req.flash('success_messages', `Product variant has been updated.`)
            res.redirect(`/products/${req.params.product_id}/variants`)
        },
        'error': async (form) => {
            res.render('products/variants-update', {
                variant: variant.toJSON(),
                variantForm: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:product_id/variants/:variant_id/delete', async (req, res) => {
    const variant = await productDataLayer.getVariantByIds(req.params.product_id, req.params.variant_id)
    res.render('products/variants-delete', {
        variant: variant.toJSON() 
    })
})

router.post('/:product_id/variants/:variant_id/delete', async (req, res) => {
    const variant = await productDataLayer.getVariantByIds(req.params.product_id, req.params.variant_id)
    await variant.destroy()
    req.flash('success_messages', `Product variant has been deleted.`)
    res.redirect(`/products/${req.params.product_id}/variants`)
})

// ================================
// ===== Product Label Routes =====
// ================================

router.get('/labels', async (req, res) => {
    const materialForm = createMaterialForm()
    res.render('products/labels', {
        materialForm: materialForm.toHTML(bootstrapField)
    })
})

module.exports = router