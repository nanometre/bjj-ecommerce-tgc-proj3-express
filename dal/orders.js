const { OrderItem, Order, Status, Address } = require('../models')

// =================================================
// =========== Orders Data Access Layer ============
// =================================================
const getAllOrders = async () => {
    return await Order.fetchAll({
        require: false,
        withRelated: ['variants', 'user', 'status', 'address']
    })
}

const getOrderByOrderId = async (orderId) => {
    return await Order.where({
        order_id: orderId
    }).fetch({
        require: false,
        withRelated: ['user', 'status', 'address', 'orderItems']
    })
}

const getOrdersByUserId = async (userId) => {
    return await Order.collection().where({
        user_id: userId
    }).fetch({
        require: false,
        withRelated: ['variants', 'user', 'status', 'address']
    })
}

// Think how to implement search for order management
// const getOrdersByUser = async (userId) => {

// }

const createOrder = async (stripeSession, addressId) => {
    const order = new Order({
        user_id: stripeSession.metadata.user_id,
        status_id: 1,
        address_id: addressId,
        total_cost: stripeSession.amount_total,
        payment_ref: stripeSession.payment_intent,
        order_datetime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    })
    await order.save()
    return order
}

const deleteOrder = async () => {
    const order = await getOrderByOrderId(orderId)
    await order.destroy()
}

// ===============================
// =========== Status ============
// ===============================
const getAllStatuses = async () => {
    return await Status.fetchAll().map(status => {
        return [status.get('status_id'), status.get('status_name')]
    })
}

const updateOrderStatus = async (orderId, newStatusId) => {
    const order = await getOrderByOrderId(orderId)
    order.set('status_id', newStatusId)
    await order.save()
    return order
}

// ===============================
// =========== Address ===========
// ===============================
const createAddress = async (address) => {
    const shippingAddress = new Address({
        address_line_1: address.line1,
        address_line_2: address.line2,
        country: address.country,
        state: address.state,
        city: address.city,
        postal_code: address.postal_code
    })
    await shippingAddress.save()
    return shippingAddress
}

// =================================================
// ========= Order Items Data Access Layer =========
// =================================================
const getOrderItemsByOrderId = async (orderId) => {
    return await OrderItem.where({
        order_id: orderId
    }).fetchAll({
        require: false,
        withRelated: ['variant', 'variant.product.brand', 'variant.color', 'variant.size']
    })
}

const getOrderItemsByVariantId = async (variantId) => {
    return await OrderItem.where({
        variant_id: variantId
    }).fetchAll({
        require: false
    })
}

const createOrderItem = async (orderId, variantId, quantity) => {
    const orderItem = new OrderItem({
        order_id: orderId,
        variant_id: variantId,
        quantity
    })
    await orderItem.save()
    return orderItem
}

module.exports = { 
    getAllOrders, getOrdersByUserId, getOrderByOrderId,
    // getOrdersByUser,
    createOrder, deleteOrder,
    getAllStatuses, updateOrderStatus,
    createAddress,
    getOrderItemsByOrderId, getOrderItemsByVariantId, createOrderItem
 }