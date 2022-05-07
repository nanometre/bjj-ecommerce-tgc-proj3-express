// =================================================
// ============== Import Dependencies ==============
// =================================================
const express = require('express')
const router = express.Router()
const productDataLayer = require('../../dal/products')

// =================================================
// ================== Set Routes ===================
// =================================================
router.get('/', async (req, res) => {
    const products = await productDataLayer.getProducts()
    res.send(products)
})

router.get('/:product_id/variant', async (req, res) => {
    const product = await productDataLayer.getProductById(req.params.product_id)
    const variants = await productDataLayer.getVariantsByProductId(req.params.product_id)
    res.send({
        product,
        variants
    })
})

module.exports = router