// =================================================
// ============== Import Dependencies ==============
// =================================================
const express = require('express');
const router = express.Router();
const CartServices = require('../../services/cart_services');
const OrderServices = require('../../services/order_services');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// TODO
// will need to amend the 'render' to 'send' if this is to be used by an api
// need to edit the disable csrf from api routes as well
// and data sent thru api are in json format
router.get('/', async (req, res) => {
    let cartServices = new CartServices(req.session.user.user_id)
    const cartItems = await cartServices.getCart()

    // 1. create the line items 
    let lineItems = [];
    let meta = [];
    for (let cartItem of cartItems) {
        // TODO: consider what other item I want to send to stripe.
        const lineItem = {
            name: cartItem.related('variant').related('product').get('product_name'),
            images: [cartItem.related('variant').get('product_thumbnail_url')],
            amount: cartItem.related('variant').related('product').get('cost'),
            quantity: cartItem.get('quantity'),
            currency: 'SGD'
        }
        lineItems.push(lineItem)
        // save the variant id and quantity in metadata for order processing
        meta.push({
            cart_item_id: cartItem.get('cart_item_id'),
            variant_id: cartItem.get('variant_id'),
            quantity: cartItem.get('quantity')
        })
    }

    // 2. create stripe payment
    let metaData = JSON.stringify(meta);
    const payment = {
        payment_method_types: ['card'],
        line_items: lineItems,
        success_url: process.env.STRIPE_SUCCESS_URL + '?sessionsId={CHECKOUT_SESSION_ID}',
        cancel_url: process.env.STRIPE_CANCELLED_URL,
        shipping_address_collection: {
            allowed_countries: ['SG', 'AU', 'GB', 'US'],
        },
        metadata: {
            user_id: req.session.user.user_id,
            orders: metaData
        }
    }

    // 3. register the session
    let stripeSession = await Stripe.checkout.sessions.create(payment)
    res.render('checkout_test/checkout', {
        sessionId: stripeSession.id,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    })
})

router.get('/success', function (req, res) {
    res.render('checkout_test/success')
})

router.get('/cancelled', function (req, res) {
    res.render('checkout_test/cancelled')
})

router.post('/process_payment', express.raw({
    'type': 'application/json'
}), async function (req, res) {
    let payload = req.body;
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers['stripe-signature'];
    let event;
    try {
        event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret)
    } catch (e) {
        res.send({
            'error': e.message
        })
    }
    if (event.type === "checkout.session.completed") {
        let stripeSession = event.data.object
        console.log(stripeSession)
        let cartServices = new CartServices(stripeSession.metadata.user_id)
        let orderServices = new OrderServices()
        await cartServices.checkoutCart(stripeSession)
        await orderServices.addOrder(stripeSession)
    }
    res.send({
        'recevied': true
    })
})

module.exports = router