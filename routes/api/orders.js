// =================================================
// ============== Import Dependencies ==============
// =================================================
const express = require('express')
const router = express.Router()
const { getOrdersByUserId } = require('../../dal/orders')

// =================================================
// ================== Set Routes ===================
// =================================================
router.get('/', async (req, res) => {
    try {
        const user = req.user
        const orders = await getOrdersByUserId(user.user_id)
        res.send(orders)
    } catch {
        res.sendStatus(500)
    }

})

module.exports = router