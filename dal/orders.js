const { OrderItem, Order, Status, Address } = require('../models')

// =================================================
// =========== Orders Data Access Layer ============
// =================================================
// get order search results
const getOrderSearchResults = async (orderSearchForm, bootstrapField, req, res) => {
    const q = Order.collection()
    orderSearchForm.handle(req, {
        empty: async (form) => {
            const orders = await q.fetch({
                withRelated: ['variants', 'user', 'status', 'address']
            })
            const resultsCount = orders.toJSON().length
            const pending = orders.toJSON().filter(order => {
                return order.status.status_name !== 'Delivered/Completed'
            })
            const completed = orders.toJSON().filter(order => {
                return order.status.status_name === 'Delivered/Completed'
            })
            res.render('orders/index', {
                orderSearchForm: form.toHTML(bootstrapField),
                resultsCount,
                pending,
                completed
            })
        },
        error: async (form) => {
            const orders = await q.fetch({
                withRelated: ['variants', 'user', 'status', 'address']
            })
            const resultsCount = orders.toJSON().length
            const pending = orders.toJSON().filter(order => {
                return order.status.status_name !== 'Delivered/Completed'
            })
            const completed = orders.toJSON().filter(order => {
                return order.status.status_name === 'Delivered/Completed'
            })
            res.render('orders/index', {
                orderSearchForm: form.toHTML(bootstrapField),
                resultsCount,
                pending,
                completed
            })
        },
        success: async (form) => {
            if (form.data.order_id) {
                q.where('order_id', '=', form.data.order_id)
            }
            if (form.data.order_date) {
                q.where('order_date', '=', form.data.order_date)
            }
            if (form.data.status_id) {
                q.where('status_id', '=', form.data.status_id)
            }
            const orders = await q.fetch({
                withRelated: ['variants', 'user', 'status', 'address']
            })
            const resultsCount = orders.toJSON().length
            const pending = orders.toJSON().filter(order => {
                return order.status.status_name !== 'Delivered/Completed'
            })
            const completed = orders.toJSON().filter(order => {
                return order.status.status_name === 'Delivered/Completed'
            })
            res.render('orders/index', {
                orderSearchForm: form.toHTML(bootstrapField),
                resultsCount,
                pending,
                completed
            })
        }
    })
}

const getOrderByOrderId = async (orderId) => {
    return await Order.where({
        order_id: orderId
    }).fetch({
        require: false,
        withRelated: ['user', 'status', 'address']
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

const createOrder = async (stripeSession, addressId) => {
    const order = new Order({
        user_id: stripeSession.metadata.user_id,
        status_id: 1,
        address_id: addressId,
        total_cost: stripeSession.amount_total,
        payment_ref: stripeSession.payment_intent,
        order_date: new Date().toISOString().slice(0, 10),
    })
    await order.save()
    return order
}

const deleteOrder = async (orderId) => {
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
const getAddressByAddressId = async (addressId) => {
    return await Address.where({
        address_id: addressId
    }).fetch({
        require: false
    })
}

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

const deleteAddress = async (addressId) => {
    const address = await getAddressByAddressId(addressId)
    await address.destroy()
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
    getOrderSearchResults, getOrdersByUserId, getOrderByOrderId, createOrder, deleteOrder,
    getAllStatuses, updateOrderStatus, getAddressByAddressId, createAddress, deleteAddress,
    getOrderItemsByOrderId, getOrderItemsByVariantId, createOrderItem
 }