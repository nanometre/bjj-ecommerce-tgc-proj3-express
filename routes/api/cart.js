// =================================================
// ============== Import Dependencies ==============
// =================================================
const express = require('express');
const router = express.Router();
const CartServices = require('../../services/cart_services')

// =================================================
// ================== Set Routes ===================
// =================================================
router.get('/', async (req, res) => {
    let user = req.user
    let cartServices = new CartServices(user.user_id)
    res.send(await cartServices.getCartItemsByUserId())
})

router.post('/:variant_id/add', async (req, res) => {
    let user = req.user
    let cartServices = new CartServices(user.user_id)
    await cartServices.addToCart(req.params.variant_id, req.body.quantity)
    res.send(`${req.body.quantity} no. of variant ID: ${req.params.variant_id} added to cart`)
})

router.post('/:variant_id/quantity/update', async (req, res) => {
    let user = req.user
    let cartServices = new CartServices(user.user_id)
    await cartServices.updateQuantityInCart(req.params.variant_id, req.body.newQuantity)
    res.send(`Updated quantity of variant ID: ${req.params.variant_id} to ${req.body.newQuantity} in cart`)
})

router.get('/:variant_id/delete', async (req, res) => {
    let user = req.user
    let cartServices = new CartServices(user.user_id)
    await cartServices.removeFromCart(req.params.variant_id)
    res.send(`Deleted variant ID: ${req.params.variant_id} from cart`)
})

module.exports = router;