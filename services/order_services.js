const orderDataLayer = require('../dal/orders')
const { getVariantById } = require('../dal/products')

class OrderServices {
    constructor(order_id) {
        this.order_id = order_id
    }
    // get a single order by order id
    async getOrderByOrderId() {
        return await orderDataLayer.getOrderByOrderId(this.order_id)
    }
    // get all order items of an order by order id
    async getOrderItemsByOrderId() {
        return await orderDataLayer.getOrderItemsByOrderId(this.order_id)
    }
    // add order to order tables on successful payment/checkout session
    async addOrder(stripeSession) {
        const address = await orderDataLayer.createAddress(
            stripeSession.customer_details.address
        )
        const order = await orderDataLayer.createOrder(
            stripeSession,
            address.toJSON().address_id
        )
        const orderItems = JSON.parse(stripeSession.metadata.orders)
        for (let orderItem of orderItems) {
            await orderDataLayer.createOrderItem(
                order.toJSON().order_id,
                orderItem['variant_id'],
                orderItem['quantity']
            )
        }
    }
    // delete order 
    async deleteOrder() {
        const order = await orderDataLayer.getOrderByOrderId(this.order_id)
        const orderItems = await orderDataLayer.getOrderItemsByOrderId(this.order_id)
        if (orderItems.toJSON().length !== 0) {
            for (let orderItem of orderItems.toJSON()) {
                const variant = await getVariantById(orderItem.variant_id)
                variant.set('stock', variant.get('stock') + orderItem.quantity)
                await variant.save()
            }
        }
        await orderDataLayer.deleteOrder(this.order_id)
        await orderDataLayer.deleteAddress(order.get('address_id'))
    }
    // update order status
    async updateOrderStatus(newStatusId) {
        return await orderDataLayer.updateOrderStatus(this.order_id, newStatusId)
    }
    // get all order statuses for form selection
    async getAllStatuses() {
        const allStatuses = await orderDataLayer.getAllStatuses()
        allStatuses.unshift(['', '---Select Status---'])
        return allStatuses
    }
}

module.exports = OrderServices