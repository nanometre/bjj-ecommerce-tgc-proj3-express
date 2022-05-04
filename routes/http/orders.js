// =================================================
// ============== Import Dependencies ==============
// =================================================
const express = require('express');
const router = express.Router();
const OrderServices = require('../../services/order_services');
const { bootstrapField, createStatusForm, createOrderSearchForm } = require('../../forms');


router.get('/', async (req, res) => {
    const orderServices = new OrderServices()
    const orderSearchForm = createOrderSearchForm(await orderServices.getAllStatuses())
    orderServices.getOrderSearchResults(orderSearchForm, bootstrapField, req, res)
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

router.get('/:order_id/delete', async (req, res) => {
    const orderServices = new OrderServices(req.params.order_id)
    const order = await orderServices.getOrderByOrderId()
    if (order.toJSON().status.status_name === 'Delivered/Completed') {
        req.flash('error_messages', 'Completed orders cannot be deleted.')
        res.redirect('/orders')
    } else {
        res.render('orders/delete', {
            order: order.toJSON()
        })
    }
})

router.post('/:order_id/delete', async (req, res) => {
    const orderServices = new OrderServices(req.params.order_id)
    await orderServices.deleteOrder()
    req.flash('success_messages', 'Order has been deleted.')
    res.redirect('/orders')
})

module.exports = router
