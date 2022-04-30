const express = require('express');
const router = express.Router();
const CartServices = require('../../services/cart_services')
// TOCHANGE
// will need to amend the 'render' to 'send' if this is to be used by an api
// need to edit the disable csrf from api routes as well
// and data sent thru api are in json format

router.get('/', async (req, res) => {
    let cartServices = new CartServices(req.session.user.user_id)
    const cartItems = await cartServices.getCart()
    res.render('cart_test/index', {
        cartItems: cartItems.toJSON()
    })
})

router.get('/:variant_id/delete', async (req, res) => {
    let cartServices = new CartServices(req.session.user.user_id)
    await cartServices.removeFromCart(req.params.variant_id)
    req.flash('success_messages', "Deleted from cart");
    res.redirect('/cart')
})

module.exports = router;