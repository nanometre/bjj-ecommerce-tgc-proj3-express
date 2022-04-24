// =================================================
// ============== Import Dependencies ==============
// =================================================
const express = require('express')
const router = express.Router()
const { Product } = require('../models')

// =================================================
// ================== Set Routes ===================
// =================================================
router.get("/", async (req, res) => {
    const products = await Product.collection().fetch()
    res.render('../views/products/index.hbs', {
        products: products.toJSON()
    })
})

module.exports = router