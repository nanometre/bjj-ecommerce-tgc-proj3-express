// =================================================
// ============== Import Dependencies ==============
// =================================================
const express = require('express');
const router = express.Router();
const CartServices = require('../../services/cart_services')
// TODO:
// will need to amend the 'render' to 'send' if this is to be used by an api
// need to edit the disable csrf from api routes as well
// and data sent thru api are in json format

router.get('/', async (req, res) => {
    let cartServices = new CartServices(req.session.user.user_id)
    const cartItems = await cartServices.getCartItemsByUserId()
    res.render('cart_test/index', {
        cartItems: cartItems.toJSON()
    })
})

// TODO: change the api route such that users can specify the amount they want to add to cart
// route to be '/:variant_id/:quantity/add
router.get('/:variant_id/add', async (req, res) => {
    let cartServices = new CartServices(req.session.user.user_id)
    await cartServices.addToCart(req.params.variant_id, 1)
    res.redirect('/cart')
})

router.post('/:variant_id/quantity/update', async (req, res) => {
    let cartServices = new CartServices(req.session.user.user_id)
    await cartServices.updateQuantityInCart(req.params.variant_id, req.body.newQuantity)
    req.flash('success_messages', 'Quantity changed.')
    res.redirect('/cart')
})

router.get('/:variant_id/delete', async (req, res) => {
    let cartServices = new CartServices(req.session.user.user_id)
    await cartServices.removeFromCart(req.params.variant_id)
    req.flash('success_messages', "Deleted from cart.");
    res.redirect('/cart')
})

module.exports = router;