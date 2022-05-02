const express = require('express');
const router = express.Router();
const OrderServices = require('../../services/order_services');

router.get('/', async (req, res) => {
    const orderServices = new OrderServices()
    const orders = await orderServices.getAllOrders()
    const pending = orders.toJSON().filter(order => {
        return order.status.status_name !== 'Delivered/Completed'
    })
    const completed = orders.toJSON().filter(order => {
        return order.status.status_name === 'Delivered/Completed'
    })
    console.log(pending)
    res.render('orders/index', {
        pending,
        completed
    })
})

module.exports = router
