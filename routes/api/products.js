// =================================================
// ============== Import Dependencies ==============
// =================================================
const express = require('express')
const router = express.Router()
const productDataLayer = require('../../dal/products')
const { Product } = require('../../models')

// =================================================
// ================== Set Routes ===================
// =================================================
router.get('/', async (req, res) => {
    try {
        const products = await productDataLayer.getProducts()
        res.send(products)
    } catch {
        res.sendStatus(500)
    }

})

router.post('/', async (req, res) => {
    try {
        const q = Product.collection()
        if (Object.keys(req.body).length === 0) {
            const products = await q.fetch({
                withRelated: ['material', 'weave', 'category', 'brand', 'variants']
            })
            res.send(products)
        }
        else if (Object.keys(req.body).length != 0) {
            if (req.body.name) {
                q.where('product_name', 'ilike', '%' + req.body.name + '%')
            }
            if (req.body.min_cost) {
                q.where('cost', '>=', (req.body.min_cost * 100).toString())
            }
            if (req.body.max_cost) {
                q.where('cost', '<=', (req.body.max_cost * 100).toString())
            }
            if (req.body.min_weight) {
                q.where('weight', '>=', req.body.min_weight)
            }
            if (req.body.max_weight) {
                q.where('weight', '<=', req.body.max_weight)
            }
            if (req.body.material_id) {
                q.where('material_id', '=', req.body.material_id)
            }
            if (req.body.weave_id) {
                q.where('weave_id', '=', req.body.weave_id)
            }
            if (req.body.category_id) {
                q.where('category_id', '=', req.body.category_id)
            }
            if (req.body.brand_id) {
                q.where('brand_id', '=', req.body.brand_id)
            }
            const products = await q.fetch({
                withRelated: ['material', 'weave', 'category', 'brand', 'variants']
            })
            res.send(products)
        }
    } catch {
        res.sendStatus(500)
    }

})

router.get('/materials', async (req, res) => {
    try {
        const materials = await productDataLayer.getAllMaterials()
        res.send(materials)
    } catch {
        res.sendStatus(500)
    }
})

router.get('/weaves', async (req, res) => {
    try {
        const weaves = await productDataLayer.getAllWeaves()
        res.send(weaves)
    } catch {
        res.sendStatus(500)
    }
})

router.get('/categories', async (req, res) => {
    try {
        const categories = await productDataLayer.getAllCategories()
        res.send(categories)
    } catch {
        res.sendStatus(500)
    }
})

router.get('/brands', async (req, res) => {
    try {
        const brands = await productDataLayer.getAllBrands()
        res.send(brands)
    } catch {
        res.sendStatus(500)
    }
})

router.get('/:product_id/variants', async (req, res) => {
    try {
        const product = await productDataLayer.getProductById(req.params.product_id)
        const variants = await productDataLayer.getVariantsByProductId(req.params.product_id)
        res.send({
            product,
            variants
        })
    } catch {
        res.sendStatus(500)
    }
})

module.exports = router