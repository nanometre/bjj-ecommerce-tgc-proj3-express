// =================================================
// ============== Import Dependencies ==============
// =================================================
const express = require('express');
const router = express.Router();
const OrderServices = require('../../services/order_services');
const { bootstrapField, createStatusForm } = require('../../forms');


router.get('/', async (req, res) => {
    const orderServices = new OrderServices()
    const orders = await orderServices.getAllOrders()
    const pending = orders.toJSON().filter(order => {
        return order.status.status_name !== 'Delivered/Completed'
    })
    const completed = orders.toJSON().filter(order => {
        return order.status.status_name === 'Delivered/Completed'
    })
    res.render('orders/index', {
        pending,
        completed
    })
})

router.get('/:order_id/items', async (req, res) => {
    const orderServices = new OrderServices(req.params.order_id)
    const order = await orderServices.getOrderByOrderId()
    const orderItems = await orderServices.getOrderItemsByOrderId()
    const statusForm = createStatusForm(await orderServices.getAllStatuses())

    statusForm.fields.status_id.value = order.get('status_id')

    res.render('orders/order-items', {
        order: order.toJSON(),
        orderItems: orderItems.toJSON(),
        statusForm: statusForm.toHTML(bootstrapField)
    })
})

router.post('/:order_id/status/update', async (req, res) => {
    const orderServices = new OrderServices(req.params.order_id)
    await orderServices.updateOrderStatus(req.body.status_id)
    req.flash('success_messages', 'Order status changed.')
    res.redirect(`/orders/${req.params.order_id}/items`)
})

module.exports = router
